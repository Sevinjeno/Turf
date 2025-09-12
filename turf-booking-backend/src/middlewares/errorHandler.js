export const errorHandler = (err, req, res, next) => {
  console.error(err.stack); // Log full error in server logs

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Something went wrong';

  res.status(statusCode).json({
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }) // Only show stack trace in dev
  });
};
