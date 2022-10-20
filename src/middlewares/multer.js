import multer from 'multer';

/**
 * MULTER MIDDLEWARE
 * @type {import('express').RequestHandler}
 */
export const multerMiddleware = (req, res, next) => {
  return multer({
    fileFilter: (req, file, cb) => {
      if (
        file.mimetype === 'image/jpeg' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/png'
      ) {
        cb(null, true);
      } else {
        cb(null, false);
      }
    },
  }).single('image');
};
