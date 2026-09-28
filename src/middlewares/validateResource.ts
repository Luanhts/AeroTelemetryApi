import { Request, Response, NextFunction } from 'express';
import { ZodType, ZodError, z } from 'zod'; // Importando o 'z' aqui

export const validate =
  (schema: ZodType) => (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({ body: req.body, query: req.query, params: req.params });

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          message: 'Falha na validação dos dados',
          errors: z.treeifyError(error),
        });
      }
      next(error);
    }
  };
