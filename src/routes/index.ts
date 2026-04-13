import { Application } from 'express';
import courseRouter from './CourseRoutes';
import lessonRouter from './LessonRoutes';
import userRouter from './UserRoutes';
import enrollmentRouter from './EnrollmentRoutes';

export default class Routes {
  constructor(app: Application) {
    // course reoutes
    app.use('/api/courses', courseRouter);
    // lesson routes
    app.use('/api/lessons', lessonRouter);
    // user routes
    app.use('/api/users', userRouter);
    // enrollment routes
    app.use('/api/enrollments', enrollmentRouter);
  }
}
