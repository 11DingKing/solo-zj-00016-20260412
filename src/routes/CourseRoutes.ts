import { Router } from 'express';
import CoursesCtrl from '../controllers/CoursesCtrl';
import { authMiddleware, adminMiddleware } from '../middlewares/auth';

class CourseRoutes {
  router = Router();
  coursesCtrl = new CoursesCtrl();

  constructor() {
    this.intializeRoutes();
  }
  intializeRoutes() {
    this.router.route('/').get(this.coursesCtrl.getAllCourses);
    this.router.route('/:id').get(this.coursesCtrl.getCourseDetails);

    this.router
      .route('/')
      .post(authMiddleware, adminMiddleware, this.coursesCtrl.createCourse);
    this.router
      .route('/:id')
      .put(authMiddleware, adminMiddleware, this.coursesCtrl.updateCourse)
      .delete(authMiddleware, adminMiddleware, this.coursesCtrl.deleteCourse);
  }
}
export default new CourseRoutes().router;
