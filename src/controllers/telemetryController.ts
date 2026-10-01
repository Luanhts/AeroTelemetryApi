import { type Request, type Response } from 'express';
import {
  InvalidTelemetryPayloadError,
  TelemetryService,
  TelemetrySessionNotActiveError,
  TelemetrySessionNotFoundError,
  UnsupportedVehicleTypeError,
} from '../services/telemetryService.js';

const telemetryService = new TelemetryService();

export class TelemetryController {
  async create(req: Request, res: Response) {
    try {
      const userId = res.locals.user.id;
      const sessionId = req.params.sessionId as string;

      if (!sessionId) {
        return res.status(400).json({
          message: 'Session ID is required',
        });
      }

      const telemetry = await telemetryService.create(
        sessionId,
        userId,
        req.body,
      );

      return res.status(201).json(telemetry);
    } catch (error) {
      if (error instanceof TelemetrySessionNotFoundError) {
        return res.status(404).json({
          message: 'Telemetry session not found',
        });
      }

      if (error instanceof TelemetrySessionNotActiveError) {
        return res.status(409).json({
          message: 'Telemetry session is not active',
        });
      }

      if (error instanceof InvalidTelemetryPayloadError) {
        return res.status(400).json({
          message: 'Telemetry payload does not match the session vehicle type',
        });
      }

      if (error instanceof UnsupportedVehicleTypeError) {
        return res.status(400).json({
          message: 'Unsupported vehicle type',
        });
      }

      console.error(error);

      return res.status(500).json({
        message: 'Error creating telemetry',
      });
    }
  }

  async getAllBySession(req: Request, res: Response) {
    try {
      const userId = res.locals.user.id;
      const sessionId = req.params.sessionId as string;

      if (!sessionId) {
        return res.status(400).json({
          message: 'Session ID is required',
        });
      }

      const telemetry = await telemetryService.getAllBySessionId(
        sessionId,
        userId,
      );

      return res.status(200).json(telemetry);
    } catch (error) {
      if (error instanceof TelemetrySessionNotFoundError) {
        return res.status(404).json({
          message: 'Telemetry session not found',
        });
      }

      console.error(error);

      return res.status(500).json({
        message: 'Error finding telemetry data',
      });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const userId = res.locals.user.id;
      const telemetryId = req.params.telemetryId as string;

      if (!telemetryId) {
        return res.status(400).json({
          message: 'Telemetry ID is required',
        });
      }

      const telemetry = await telemetryService.getById(telemetryId, userId);

      if (!telemetry) {
        return res.status(404).json({
          message: 'Telemetry not found',
        });
      }

      return res.status(200).json(telemetry);
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message: 'Error finding telemetry',
      });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const userId = res.locals.user.id;
      const telemetryId = req.params.telemetryId as string;

      if (!telemetryId) {
        return res.status(400).json({
          message: 'Telemetry ID is required',
        });
      }

      const telemetry = await telemetryService.delete(telemetryId, userId);

      if (!telemetry) {
        return res.status(404).json({
          message: 'Telemetry not found',
        });
      }

      return res.status(200).json({
        message: 'Telemetry removed successfully',
        telemetry,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message: 'Error deleting telemetry',
      });
    }
  }
}
