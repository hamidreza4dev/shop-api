import path from 'path';
import fs from 'fs';
import { promisify } from 'util';

import { rootPath } from './rootPath.js';

const unlinkSync = promisify(fs.unlink);

const deleteFile = function (filePath) {
  return unlinkSync(path.join(rootPath, filePath));
};

export default deleteFile;
