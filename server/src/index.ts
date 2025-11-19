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
import { PrismaClient } from '@prisma/client';

import donorRouter from './routes/donorRoutes';
import programRouter from './routes/programRoutes';
import donatedItemRouter from './routes/donatedItemRoutes';
import donatedItemStatusRouter from './routes/donatedItemStatusRoutes';
import passwordResetRouter from './routes/passwordResetRoutes';
import barcodeRouter from './routes/barcode'; // barcode routes

dotenv.config(); // Load environment variables

const prisma = new PrismaClient(); // Initialize Prisma Client
const app = express();

// CORS – allow frontend dev server
app.use(cors({ origin: 'http://localhost:3000' }));

// View engine (if you actually use Jade views)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

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

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
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
      ...(process.env.NODE_ENV !== 'production' ? { stack: err.stack } : {}),
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
    console.log(`[${timestamp}] Logger: Connected to the database successfully!`);

    const port = Number(process.env.PORT || 5000);

    app.listen(port, () => {
      console.log(`[${timestamp}] Server running on http://localhost:${port}`);
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
