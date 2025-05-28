// Handler untuk rute yang tidak ditemukan
const routeNotFoundHandler = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Handler error umum
const generalErrorHandler = (err, req, res, next) => {
  // Jika statusCode belum di-set atau masih 200 (OK) padahal ada error,
  // set ke 500 (Internal Server Error). Jika sudah di-set (misal 400, 401, 404), gunakan itu.
  const statusCode =
    res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode);
  res.json({
    message: err.message,
    // Tampilkan stack trace hanya di environment development, bukan di produksi
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

module.exports = {
  routeNotFoundHandler,
  generalErrorHandler,
};
