const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const {
  getSessions, createSession, deleteSession
} = require('../controllers/sessionController');

router.get('/',       verifyToken, getSessions);
router.post('/',      verifyToken, createSession);
router.delete('/:id', verifyToken, deleteSession);

module.exports = router;