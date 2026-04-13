import * as Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

interface UserRequest extends Request {
  value?: { body?: string };
}

export class UserValidator {
  constructor() {}

  validateBody(schema) {
    return async (req: UserRequest, res: Response, next: NextFunction) => {
      try {
        const val = await schema.validateAsync(req.body);
        req.value = req.value ?? {};
        req.value.body = req.value.body ?? val;
        next();
      } catch (error) {
        res.status(400).json(error);
      }
    };
  }
}

export const registerSchema = Joi.object().keys({
  username: Joi.string().trim().min(3).max(30).required(),
  email: Joi.string().trim().email().required(),
  password: Joi.string().min(6).required(),
});

export const loginSchema = Joi.object().keys({
  email: Joi.string().trim().email().required(),
  password: Joi.string().required(),
});
