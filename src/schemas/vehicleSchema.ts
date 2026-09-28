import { z } from 'zod';

export const updateVehicleSchema = z.object({
  body: z
    .object({
      name: z
        .string()
        .min(2, 'Name deve ter no mínimo 2 caracteres')
        .optional(),
      type: z
        .string()
        .min(2, 'Type deve ter no mínimo 2 caracteres')
        .optional(),
      active: z
        .boolean({ error: 'Active deve ser booleano' })
        .optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: 'É necessário enviar pelo menos um campo para atualização',
    }),
});
