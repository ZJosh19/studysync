const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const {
  getDeadlines, createDeadline, updateDeadline, deleteDeadline
} = require('../controllers/deadlineController');

router.get('/',       verifyToken, getDeadlines);
router.post('/',      verifyToken, createDeadline);
router.put('/:id',    verifyToken, updateDeadline);
router.delete('/:id', verifyToken, deleteDeadline);

module.exports = router;