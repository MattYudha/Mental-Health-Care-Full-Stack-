const express = require("express");
const router = express.Router();

// Contoh rute (Anda bisa menambahkan rute-rute lain di sini atau mengimpornya dari file lain)
router.get("/test", (req, res) => {
  res.json({ message: "Rute API backend berfungsi!" });
});

// Impor rute lain jika ada, misalnya:
// const userRoutes = require('./userRoutes');
// router.use('/users', userRoutes);

module.exports = router;
