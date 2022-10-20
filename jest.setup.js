import path from 'path';
import { rootPath } from './src/utils/rootPath.js';
import dotenv from 'dotenv';
dotenv.config({ path: path.join(rootPath, 'configs', 'config.env') });
