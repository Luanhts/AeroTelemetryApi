import express, { type Express, type Request, type Response } from 'express';
import vehicles from './vehicles/vehiclesRoutes.js';
import users from './users/usersRoutes.js';

const routes = (app: Express): void => {
    app.get('/', (req: Request, res: Response) => {
  res.send('Hello, World!');
});

app.use(express.json(), vehicles, users);
}

export default routes;