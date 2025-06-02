import createError from 'http-errors';
import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client'; // Import Prisma
const prisma = new PrismaClient(); // Initialize Prisma Client
import donorRouter from './routes/donorRoutes';
import programRouter from './routes/programRoutes';

import donatedItemRouter from './routes/donatedItemRoutes'; // Import DonatedItem routes
import donatedItemStatusRouter from './routes/donatedItemStatusRoutes'; // Import DonatedItemStatus routes
import passwordResetRouter from './routes/passwordResetRoutes';

const app = express();
dotenv.config(); // Load environment variables from .env file

app.use(cors({ origin: 'http://localhost:3000' }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/donor', donorRouter);
app.use('/program', programRouter);
app.use('/api', programRouter);
app.use('/passwordReset', passwordResetRouter);
app.use('/donatedItem', donatedItemRouter); // Use DonatedItem routes
app.use('/donatedItem/status', donatedItemStatusRouter); // Use DonatedItemStatus routes

app.use((req: Request, res: Response, next: NextFunction) => {
    next(createError(404));
});
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});
const startServer = async () => {
    const timestamp = new Date().toISOString(); // Get the current timestamp

    try {
        // Connect to the database
        await prisma.$connect();
        console.log(
            `[${timestamp}] Logger: Connected to the database successfully!`,
        );

        // Start the server
        const port = process.env.PORT;

        app.listen(port, () => {
            console.log(
                `[${timestamp}] Server running on http://localhost:${port}`,
            );
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
// Call the startServer function to start the server and connect to the DB
startServer();
process.on('SIGINT', async () => {
    await prisma.$disconnect();
    console.log('Prisma client disconnected');
    process.exit(0);
});

export default app;