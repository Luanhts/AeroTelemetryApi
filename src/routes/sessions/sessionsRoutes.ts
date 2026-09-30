import express from 'express';
import { authenticate } from '../../middlewares/Authenticator.js';
import { SessionController } from '../../controllers/sessionController.js';

const router = express.Router();
const sessionController = new SessionController();

router.use('/sessions', authenticate);
router.use('/vehicles', authenticate);

router.get('/sessions', sessionController.getAllSessions);

router.get('/sessions/:sessionId', sessionController.getSessionById);

router.patch('/sessions/:sessionId/finish', sessionController.finishSession);

router.delete('/sessions/:sessionId', sessionController.deleteSession);

router.post('/vehicles/:vehicleId/sessions', sessionController.createSession);

router.get('/vehicles/:vehicleId/sessions', sessionController.getByVehicleId);

export default router;
