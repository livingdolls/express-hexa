import { NextFunction, Request, Response } from "express";
import { z } from "zod";

export function validate(schema: z.ZodSchema) {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse({
                body: req.body,
                query: req.query,
                params: req.params,
            });

            next();
        } catch (err) {
            if(err instanceof z.ZodError) {
                res.status(400).json({
                    errors: err.errors.map(e => ({
                        path: e.path.join('.'),
                        message: e.message,
                    }))
                })
            }

            next(err);
        }
    }
}