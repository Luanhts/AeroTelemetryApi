import express, { type Express, type Request, type Response } from 'express';
import users from './users/usersRoutes.js';
import vehicles from './vehicles/vehiclesRoutes.js';
import sessions from './sessions/sessionsRoutes.js';
import telemetry from './telemetrys/telemetryRoutes.js';

const routes = (app: Express): void => {
  app.get('/', (req: Request, res: Response) => {
    res.send('Hello, World!');
  });

  app.use(express.json(), users, vehicles, sessions, telemetry);
};

export default routes;
