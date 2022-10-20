import path from 'path';

import shortid from 'shortid';
import sharp from 'sharp';

import { rootPath } from './rootPath.js';

export const uploadFile = function ({ type, folder, file, format }) {
  return new Promise(async (resolve, reject) => {
    if (!file || !folder || !format) {
      const error = new Error('required properties are not specified !');
      error.statusCode = 422;
      return reject(error);
    }

    if (type === 'image' && !['jpg', 'png'].includes(format)) {
      const error = new Error('Invalid Format . format must be jpg or png !');
      error.statusCode = 422;
      return reject(error);
    }

    const filename = `${shortid.generate()}_${file.originalname
      .split('.')
      .slice(0, -1)
      .join('')
      .slice(0, 10)}.${format}`;
    const filepath = path.join('public', 'uploads', 'images', filename);
    const uploadPath = path.join(rootPath, filepath);

    resolve(
      sharp(file.buffer)
        [format]({
          quality: 72,
        })
        .toFile(filepath)
        .catch((err) => {
          const error = new Error('Cannot save file into server !');
          error.statusCode = 500;
          reject(error);
        })
        .then((res) => ({ filename, uploadPath, filepath }))
    );
  });
};
