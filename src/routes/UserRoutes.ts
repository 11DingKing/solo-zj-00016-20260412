import { Router } from 'express';
import UsersCtrl from '../controllers/UsersCtrl';
import {
  UserValidator,
  registerSchema,
  loginSchema,
} from '../validators/userValidator';
import { authMiddleware } from '../middlewares/auth';

class UserRoutes {
  router = Router();
  usersCtrl = new UsersCtrl();
  userValidator = new UserValidator();

  constructor() {
    this.intializeRoutes();
  }

  intializeRoutes() {
    this.router
      .route('/register')
      .post(
        this.userValidator.validateBody(registerSchema),
        this.usersCtrl.register,
      );

    this.router
      .route('/login')
      .post(this.userValidator.validateBody(loginSchema), this.usersCtrl.login);

    this.router
      .route('/profile')
      .get(authMiddleware, this.usersCtrl.getProfile);
  }
}

export default new UserRoutes().router;
