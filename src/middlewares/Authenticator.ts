import { type NextFunction, type Request, type Response } from 'express';
import jwt from 'jsonwebtoken';

export function authenticate(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ message: 'Token não informado' });
    return;
  }

  const [scheme, token] = authHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    res.status(401).json({ message: 'Formato do token inválido' });
    return;
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'secret_key');
    res.locals.user = payload;
    next();
  } catch {
    res.status(401).json({ message: 'Token inválido' });
  }
}
