import { type Request, type Response } from 'express';
import { SessionRepository } from '../repositories/sessionRepository.js';

const sessionRepository = new SessionRepository();

export class SessionController {
  async createSession(req: Request, res: Response) {
    try {
      const vehicleId = req.params.vehicleId as string;
      const userId = res.locals.user.id;

      if (!vehicleId) {
        return res.status(400).json({
          message: 'Vehicle ID is required',
        });
      }

      const newSession = await sessionRepository.create(vehicleId, userId);

      if (!newSession) {
        return res.status(404).json({
          message: 'Vehicle not found',
        });
      }

      return res.status(201).json(newSession);
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message: 'Error creating session',
      });
    }
  }

  async getAllSessions(req: Request, res: Response) {
    try {
      const userId = res.locals.user.id;

      const sessions = await sessionRepository.getAllSessions(userId);

      return res.status(200).json(sessions);
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message: 'Error finding sessions',
      });
    }
  }

  async getSessionById(req: Request, res: Response) {
    try {
      const userId = res.locals.user.id;
      const sessionId = req.params.sessionId as string;

      if (!sessionId) {
        return res.status(400).json({
          message: 'Session ID is required',
        });
      }

      const session = await sessionRepository.getSessionById(sessionId, userId);

      if (!session) {
        return res.status(404).json({
          message: 'Session not found',
        });
      }

      return res.status(200).json(session);
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message: 'Error finding session',
      });
    }
  }

  async finishSession(req: Request, res: Response) {
    try {
      const userId = res.locals.user.id;
      const sessionId = req.params.sessionId as string;

      if (!sessionId) {
        return res.status(400).json({
          message: 'Session ID is required',
        });
      }

      const session = await sessionRepository.finishSession(userId, sessionId);

      if (!session) {
        return res.status(404).json({
          message: 'Session not found or already finished',
        });
      }

      return res.status(200).json({
        message: 'Session finished successfully',
        session,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message: 'Error finishing session',
      });
    }
  }

  async deleteSession(req: Request, res: Response) {
    try {
      const userId = res.locals.user.id;
      const sessionId = req.params.sessionId as string;

      if (!sessionId) {
        return res.status(400).json({
          message: 'Session ID is required',
        });
      }

      const session = await sessionRepository.deleteSession(userId, sessionId);

      if (!session) {
        return res.status(404).json({
          message: 'Session not found',
        });
      }

      return res.status(200).json({
        message: 'Session removed successfully',
        session,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message: 'Error deleting session',
      });
    }
  }

  async getByVehicleId(req: Request, res: Response) {
    try {
      const userId = res.locals.user.id;
      const vehicleId = req.params.vehicleId as string;

      if (!vehicleId) {
        return res.status(400).json({
          message: 'Vehicle ID is required',
        });
      }

      const sessions = await sessionRepository.getByVehicleId(
        userId,
        vehicleId,
      );

      return res.status(200).json(sessions);
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message: 'Failed to find sessions for the vehicle',
      });
    }
  }
}
