// src/index.ts
import 'dotenv/config';
import createError from 'http-errors';
import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';

import donorRouter from './routes/donorRoutes';
import programRouter from './routes/programRoutes';
import donatedItemRouter from './routes/donatedItemRoutes';
import donatedItemStatusRouter from './routes/donatedItemStatusRoutes';
import passwordResetRouter from './routes/passwordResetRoutes';
import barcodeRouter from './routes/barcode';
import importExportRouter from './routes/importExportRoutes';
import prisma from './prismaClient';
import { processScheduledDonationEmails } from './services/emailService';

dotenv.config(); // Load environment variables
const app = express();

// CORS – allow frontend dev server for remote access
const allowedOrigins = (process.env.CORS_ALLOWED_ORIGINS || '')
    .split(',')
    .map(origin => origin.trim())
    .filter(Boolean);

app.use(
    cors({
        origin: (origin, callback) => {
            // Never pass an error here. It propagates to the central error
            // handler, which responds 500 without any CORS headers, so the
            // browser reports a misleading "Access-Control-Allow-Origin
            // missing" instead of the real reason. Disallowed origins are
            // answered explicitly below.
            callback(null, !origin || allowedOrigins.includes(origin));
        },
    }),
);

// Answer disallowed origins with a clear 403 rather than letting the request
// (including preflights) fall through to the routers.
app.use((req: Request, res: Response, next: NextFunction) => {
    const origin = req.get('Origin');
    if (origin && !allowedOrigins.includes(origin)) {
        res.status(403).json({
            message:
                `Origin ${origin} is not allowed. Add it to ` +
                `CORS_ALLOWED_ORIGINS in your .env (comma-separated), then ` +
                `recreate the backend with: docker compose up -d mdma-backend`,
        });
        return;
    }
    next();
});

// View engine (if you actually use Pug views)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Standard middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routers
app.use('/donor', donorRouter);
app.use('/program', programRouter);
app.use('/api', programRouter); // if you really intend this duplicate mount
app.use('/passwordReset', passwordResetRouter);
app.use('/donatedItem', donatedItemRouter);
app.use('/donatedItem/status', donatedItemStatusRouter);
app.use('/', barcodeRouter); // mount barcode routes at root (e.g. /api/barcode/... inside router)
app.use('/', importExportRouter);

// Health check
app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({ status: 'ok' });
});

// 404 handler
app.use((req: Request, _res: Response, next: NextFunction) => {
    const err: any = new Error('Not Found');
    err.status = 404;
    next(err);
});

// Central error handler
app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || 500;

    const wantsJson =
        req.originalUrl?.startsWith('/api') ||
        req.get('Accept')?.includes('application/json');

    if (wantsJson) {
        res.status(status).json({
            message: err.message || 'Internal Server Error',
            ...(process.env.NODE_ENV !== 'production'
                ? { stack: err.stack }
                : {}),
        });
        return;
    }

    res.status(status);
    if (typeof res.render === 'function' && req.app.get('views')) {
        try {
            return res.render('error', { message: err.message, error: err });
        } catch (renderErr) {
            // eslint-disable-next-line no-console
            console.error('Error rendering error view:', renderErr);
        }
    }

    res.send(`${status} - ${err.message}`);
});

// ---- Server startup + Prisma wiring ----

const startServer = async () => {
    const timestamp = new Date().toISOString();

    try {
        await prisma.$connect();
        console.log(
            `[${timestamp}] Logger: Connected to the database successfully!`,
        );

        const port = Number(process.env.PORT || 5000);

        app.listen(port, () => {
            console.log(
                `[${timestamp}] Server running on http://localhost:${port}`,
            );

            const checkScheduledEmails = async () => {
                try {
                    await processScheduledDonationEmails();
                } catch (error) {
                    console.error('Error processing scheduled emails:', error);
                }
            };

            void checkScheduledEmails();

            setInterval(() => {
                void checkScheduledEmails();
            }, 60_000);
        });
    } catch (error) {
        console.error('Error connecting to the database:', error);
        console.error(
            `[${timestamp}] Error connecting to the database:`,
            (error as Error).message,
        );
        console.error('Stack Trace:', (error as Error).stack);
    }
};

// Only start listening if this file is run directly (not when imported by tests)
if (require.main === module) {
    void startServer();

    process.on('SIGINT', async () => {
        await prisma.$disconnect();
        console.log('Prisma client disconnected');
        process.exit(0);
    });
}

export default app;
