import path from 'path';

import express from 'express';
import dotenv from 'dotenv';
import d from 'debug';
import cors from 'cors';
import morgan from 'morgan';

import connectDB from './services/database.js';
import router from './routes/router.js';
import { rootPath } from './utils/rootPath.js';
import logger from './services/winston.js';
import { errorMiddleware } from './middlewares/errors.js';
import { multerMiddleware } from './middlewares/multer.js';
import multer from 'multer';

// application
dotenv.config({ path: path.join(rootPath, 'configs', 'config.env') });
const PORT = process.env.NODE_ENV === 'test' ? 3000 : process.env.PORT || 5000;
const app = express();
export const debug = d('shop');

// statics
app.use('/public', express.static(path.join(rootPath, 'public')));

// middlewares
app.use(cors());
app.use(express.json());
app.use(multerMiddleware());
app.use(morgan('combined', { stream: logger.stream }));

// routes
app.use(router);

// errors
app.use(errorMiddleware);

// server
await connectDB();
export const server = app.listen(PORT, () => {
  debug(`Server is running on http://localhost:${PORT}/`);
});
