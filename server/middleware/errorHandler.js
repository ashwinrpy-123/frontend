export function notFoundHandler(req, res, _next) {
  res.status(404).json({ error: 'not_found', path: req.originalUrl });
}

export function errorHandler(err, _req, res, _next) {
  const isProd = process.env.NODE_ENV === 'production';
  const status = err.status || err.statusCode || 500;
  const payload = {
    error: 'internal_error',
    message: isProd ? 'An unexpected error occurred.' : err.message,
  };

  if (!isProd) {
    payload.stack = err.stack;
  }

  res.status(status).json(payload);
}



