import express, { type Express, type Request, type Response } from 'express';
import routes from './routes/index.js';

const app: Express = express();
app.use(express.json());
routes(app);



export default app;