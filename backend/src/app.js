const express = require("express");
const cors = require("cors");
const allRoutes = require("./routes"); // Mengimpor dari src/routes/index.js
const {
  routeNotFoundHandler,
  generalErrorHandler,
} = require("./utils/errorHandler");

const app = express();

// Middleware
app.use(cors()); // Izinkan request dari domain lain (misalnya frontend Anda)
app.use(express.json()); // Untuk parsing body JSON dari request
app.use(express.urlencoded({ extended: true })); // Untuk parsing body URL-encoded dari request

// Middleware untuk logging request ke /api
const logApiRequests = (req, res, next) => {
  console.log(
    `[app.js] Request to /api path: ${req.method} ${req.originalUrl}`
  );
  next();
};

// Rute Aplikasi Utama
// Semua rute yang didefinisikan di src/routes/index.js akan diawali dengan /api
app.use("/api", logApiRequests, allRoutes);

// Rute untuk path root (/)
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to the Mental Health Care API!",
    status: "API is running",
    documentation: "/api-docs", // Contoh jika Anda memiliki dokumentasi
  });
});

// Middleware Error Handling (harus diletakkan setelah semua rute)
app.use(routeNotFoundHandler); // Menangani rute yang tidak ditemukan (404)
app.use(generalErrorHandler); // Menangani error umum lainnya

module.exports = app;
