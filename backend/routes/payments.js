const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/upload-proof', protect, upload.single('proof'), paymentController.uploadProof);

module.exports = router;
