const express = require('express');
const sessionController = require('../controllers/sessionController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/create', sessionController.createSession);

router.get('/availableSessions', authMiddleware.verifyToken, sessionController.getAvailableSessions);

router.post('/joinSession/:sessionId',  authMiddleware.verifyToken,sessionController.joinSession);

router.put('/updateSession/:sessionId', authMiddleware.verifyToken, sessionController.updateSession);

router.get('/session/:sessionId', authMiddleware.verifyToken, sessionController.getSpecificSession);


module.exports = router;
