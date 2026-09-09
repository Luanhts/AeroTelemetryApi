import { type NextFunction, type Request, type Response } from 'express';
import jwt from 'jsonwebtoken';

export function authenticate(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ message: 'Token not provided' });
    return;
  }

  const [scheme, token] = authHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    res.status(401).json({ message: 'Invalid token format' });
    return;
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET || 'secret_key');
    res.locals.user = user;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
}
