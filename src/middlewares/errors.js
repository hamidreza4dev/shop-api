import mongoose from 'mongoose';

/**
 * ERROR HANDLING
 * @type {import('express').ErrorRequestHandler}
 */
export const errorMiddleware = (error, req, res, next) => {
  const message = error.message;
  const data = error.data || {};
  const statusCode = error.statusCode || 500;

  if (error instanceof mongoose.Error.CastError) {
    res.status(422).json({
      success: false,
      message: 'Invalid Id.',
      data,
    });
  }

  res.status(statusCode).json({
    success: false,
    message,
    data,
  });
};
