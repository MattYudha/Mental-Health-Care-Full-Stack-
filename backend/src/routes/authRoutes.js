const express = require("express");
// Komentari import asli untuk sementara
// const { register, login, logout, getCurrentUser } = require('../controllers/authController');
// const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// Middleware untuk logging di level authRoutes
router.use((req, res, next) => {
  console.log(
    `[authRoutes.js SIMPLIFIED] Path: ${req.path}, Method: ${req.method}, URL: ${req.url}`
  );
  next();
});

router.post("/register", (req, res, next) => {
  console.log(
    `[authRoutes.js SIMPLIFIED] Attempting to match POST /register. req.url: ${req.url}`
  );
  // register(req, res, next); // Komentari controller asli
  res.status(200).json({ message: "Simplified POST /register route hit!" });
});

// Komentari rute lain untuk sementara
// router.post('/login', login);
// router.post('/logout', protect, logout);

router.get("/me", (req, res, next) => {
  // Hapus 'protect' dan controller asli untuk sementara
  console.log(
    `[authRoutes.js SIMPLIFIED] Attempting to match GET /me. req.url: ${req.url}`
  );
  // getCurrentUser(req, res, next); // Komentari controller asli
  res.status(200).json({ message: "Simplified GET /me route hit!" });
});

module.exports = router;
