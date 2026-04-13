import { Request, Response, NextFunction } from 'express';
import UserRepo from './../repositories/UserRepo';
import { apiErrorHandler } from './../handlers/errorHandler';
import { generateToken, hashPassword, comparePassword } from './../utils/jwt';
import { AuthRequest } from './../middlewares/auth';

export default class UsersCtrl {
  constructor() {}

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { username, email, password } = req['value']['body'];

      const existingUser = await UserRepo.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: 'Email already registered' });
      }

      const existingUsername = await UserRepo.findByUsername(username);
      if (existingUsername) {
        return res.status(400).json({ message: 'Username already taken' });
      }

      const hashedPassword = await hashPassword(password);
      const user = await UserRepo.createUser({
        username,
        email,
        password: hashedPassword,
      });

      const token = generateToken({
        id: user.id,
        email: user.email,
        role: user.role,
      });

      res.status(201).json({
        message: 'User registered successfully',
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      apiErrorHandler(error, req, res, 'Registration failed.');
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req['value']['body'];

      const user = await UserRepo.findByEmail(email);
      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const isPasswordValid = await comparePassword(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const token = generateToken({
        id: user.id,
        email: user.email,
        role: user.role,
      });

      res.json({
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      apiErrorHandler(error, req, res, 'Login failed.');
    }
  }

  async getProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      const user = await UserRepo.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      });
    } catch (error) {
      apiErrorHandler(error, req, res, 'Failed to get user profile.');
    }
  }
}
