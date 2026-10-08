const errorHandler = (err, req, res, next) => {
  let status = err.statusCode || err.status || (res.statusCode >= 400 ? res.statusCode : 500);
  let message = err.message || 'Internal Server Error';

  if (err.name === 'MulterError') status = 400;
  if (err.type === 'entity.parse.failed') { status = 400; message = 'Invalid JSON body'; }
  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    status = 400;
    message = err.errors?.[0]?.message || message;
  }
  if (err.name === 'SequelizeConnectionError' || err.name === 'SequelizeAccessDeniedError') {
    status = 500;
    message = `Database connection issue: ${err.message}`;
  }

  if (status >= 500) console.error('[API Error]:', err);

  res.status(status).json({
    success: false,
    message,
    data: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};

module.exports = { errorHandler };
