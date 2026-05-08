const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const {
  getSubjects, createSubject, updateSubject, deleteSubject
} = require('../controllers/subjectController');

router.get('/',     verifyToken, getSubjects);
router.post('/',    verifyToken, createSubject);
router.put('/:id',  verifyToken, updateSubject);
router.delete('/:id', verifyToken, deleteSubject);

module.exports = router;