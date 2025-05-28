const express = require('express');
const {
  createEntry,
  getEntries,
  getEntryById,
  updateEntry,
  deleteEntry,
} = require('../controllers/moodController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// Semua rute di sini akan dilindungi, memerlukan token JWT yang valid
router.use(protect);

router.route('/')
  .post(createEntry)
  .get(getEntries);

router.route('/:id')
  .get(getEntryById)
  .put(updateEntry)
  .delete(deleteEntry);

module.exports = router;
