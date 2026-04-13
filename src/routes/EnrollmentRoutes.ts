import { Router } from 'express';
import EnrollmentsCtrl from '../controllers/EnrollmentsCtrl';
import { authMiddleware } from '../middlewares/auth';

class EnrollmentRoutes {
  router = Router();
  enrollmentsCtrl = new EnrollmentsCtrl();

  constructor() {
    this.intializeRoutes();
  }

  intializeRoutes() {
    this.router
      .route('/my')
      .get(authMiddleware, this.enrollmentsCtrl.getMyEnrollments);

    this.router
      .route('/:courseId')
      .post(authMiddleware, this.enrollmentsCtrl.enrollCourse)
      .get(authMiddleware, this.enrollmentsCtrl.checkEnrollment);
  }
}

export default new EnrollmentRoutes().router;
