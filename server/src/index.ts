// src/index.ts
import 'dotenv/config';
import createError from 'http-errors';
import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

import donorRouter from './routes/donorRoutes';
import programRouter from './routes/programRoutes';
import donatedItemRouter from './routes/donatedItemRoutes';
import donatedItemStatusRouter from './routes/donatedItemStatusRoutes';
import passwordResetRouter from './routes/passwordResetRoutes';

const prisma = new PrismaClient();
const app = express();

/* ------------------------ Core middleware ------------------------ */
app.use(cors({ origin: 'http://localhost:3000' })); // adjust if needed
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/* ---------------- Serve local uploads when enabled ----------------
   Requires in .env:
     STORAGE_BACKEND=local
     UPLOADS_DIR=uploads
     PUBLIC_BASE_URL=http://localhost:5050
------------------------------------------------------------------- */
const STORAGE_BACKEND = (process.env.STORAGE_BACKEND || 'azure').toLowerCase();
if (STORAGE_BACKEND === 'local') {
  const uploadsDir = process.env.UPLOADS_DIR || 'uploads';
  const uploadsAbs = path.join(process.cwd(), uploadsDir);
  if (!fs.existsSync(uploadsAbs)) {
    fs.mkdirSync(uploadsAbs, { recursive: true });
  }
  // Files saved by the service under <repo>/<uploadsDir> will be available at http://localhost:5050/uploads/<filename>
  app.use('/uploads', express.static(uploadsAbs));
  console.log(`[startup] Local uploads enabled. Serving ${uploadsAbs} at /uploads`);
} else {
  console.log('[startup] Using non-local storage backend (e.g., Azure). /uploads not served.');
}

/* ----------------------------- Routes ---------------------------- */
app.use('/donor', donorRouter);
app.use('/program', programRouter);
app.use('/api', programRouter); // if this is intentional
app.use('/passwordReset', passwordResetRouter);
app.use('/donatedItem', donatedItemRouter);
app.use('/donatedItem/status', donatedItemStatusRouter);

/* ------------------------- 404 & Errors -------------------------- */
app.use((req: Request, res: Response, next: NextFunction) => {
  next(createError(404));
});

app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
  // If you don’t have Jade templates for errors, you can return JSON instead:
  // return res.status(err.status || 500).json({ message: err.message });

  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  try {
    res.render('error');
  } catch {
    res.json({ message: err.message || 'Server error' });
  }
});

/* -------------------------- Startup ----------------------------- */
const startServer = async () => {
  const ts = new Date().toISOString();
  try {
    await prisma.$connect();
    console.log(`[${ts}] Logger: Connected to the database successfully!`);

    const port = Number(process.env.PORT) || 5050;
    app.listen(port, () => {
      console.log(`[${ts}] Server running on http://localhost:${port}`);
      if (STORAGE_BACKEND === 'local') {
        console.log(`[${ts}] PUBLIC_BASE_URL=${process.env.PUBLIC_BASE_URL || 'http://localhost:5050'}`);
      }
    });
  } catch (error) {
    console.error('Error connecting to the database:', error);
    console.error(`[${ts}] Error connecting to the database:`, (error as Error).message);
    console.error('Stack Trace:', (error as Error).stack);
  }
};

startServer();

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  console.log('Prisma client disconnected');
  process.exit(0);
});

export default app;
