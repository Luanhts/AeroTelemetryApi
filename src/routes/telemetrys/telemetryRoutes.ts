import express from 'express';
import { authenticate } from '../../middlewares/Authenticator.js';
import { validate } from '../../middlewares/validateResource.js';
import { TelemetryController } from '../../controllers/telemetryController.js';
import { createTelemetrySchema } from '../../schemas/telemetrySchema.js';

const router = express.Router();
const telemetryController = new TelemetryController();

router.use('/sessions', authenticate);
router.use('/telemetry', authenticate);

router.post(
  '/sessions/:sessionId/telemetry',
  validate(createTelemetrySchema),
  telemetryController.create,
);

router.get(
  '/sessions/:sessionId/telemetry',
  telemetryController.getAllBySession,
);

router.get('/telemetry/:telemetryId', telemetryController.getById);

router.delete('/telemetry/:telemetryId', telemetryController.delete);

export default router;
