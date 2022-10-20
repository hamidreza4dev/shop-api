/**
 * IS ADMIN CHECK
 * @type {import('express').RequestHandler}
 * @usage should use after isAuth middleware
 */
export const isAdmin = (req, res, next) => {
  if (!req.isAdmin) {
    const error = new Error('Not Authorized !');
    error.statusCode = 401;
    return next(error);
  }
  next();
};
