import { Request, Response, NextFunction } from 'express';
import EnrollmentRepo from './../repositories/EnrollmentRepo';
import CourseRepo from './../repositories/CoursesRepo';
import { apiErrorHandler } from './../handlers/errorHandler';
import { AuthRequest } from './../middlewares/auth';

export default class EnrollmentsCtrl {
  constructor() {}

  async enrollCourse(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const courseId = parseInt(req.params.courseId);
      if (isNaN(courseId)) {
        return res.status(400).json({ message: 'Invalid course ID' });
      }

      const course = await CourseRepo.getById(courseId);
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }

      const isEnrolled = await EnrollmentRepo.isEnrolled(req.user.id, courseId);
      if (isEnrolled) {
        return res
          .status(400)
          .json({ message: 'Already enrolled in this course' });
      }

      await EnrollmentRepo.enroll(req.user.id, courseId);

      res.status(201).json({ message: 'Enrolled successfully' });
    } catch (error) {
      apiErrorHandler(error, req, res, 'Enrollment failed.');
    }
  }

  async checkEnrollment(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const courseId = parseInt(req.params.courseId);
      if (isNaN(courseId)) {
        return res.status(400).json({ message: 'Invalid course ID' });
      }

      const isEnrolled = await EnrollmentRepo.isEnrolled(req.user.id, courseId);

      res.json({ isEnrolled });
    } catch (error) {
      apiErrorHandler(error, req, res, 'Failed to check enrollment.');
    }
  }

  async getMyEnrollments(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const enrollments = await EnrollmentRepo.getEnrollmentsByUser(
        req.user.id,
      );

      res.json(enrollments);
    } catch (error) {
      apiErrorHandler(error, req, res, 'Failed to get enrollments.');
    }
  }
}
