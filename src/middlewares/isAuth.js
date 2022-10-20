import jwt from 'jsonwebtoken';

/**
 * IS AUTH
 * @type {import('express').RequestHandler}
 */
export const isAuth = (req, res, next) => {
  try {
    const raw = req.get('Authorization');
    if (!raw) {
      const error = new Error('No Token Provided !');
      error.statusCode = 422;
      throw error;
    }

    const token = raw.split(' ')[1];
    if (!token) {
      const error = new Error('No Token Provided !');
      error.statusCode = 422;
      throw error;
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    if (!decodedToken) {
      const error = new Error('Token Is Invalid or expired !');
      error.statusCode = 400;
      throw error;
    }

    req.user = decodedToken.user;
    req.isAdmin = decodedToken.user.isAdmin;

    next();
  } catch (error) {
    next(error);
  }
};
