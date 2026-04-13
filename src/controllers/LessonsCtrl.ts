import { Request, Response, NextFunction } from 'express';
import { apiErrorHandler } from '../handlers/errorHandler';
import LessonRepo from '../repositories/LessonsRepo';
import EnrollmentRepo from '../repositories/EnrollmentRepo';
import { AuthRequest } from '../middlewares/auth';

export default class LessonsCtrl {
  constructor() {}

  async getAllLessons(req: Request, res: Response, next: NextFunction) {
    try {
      const lessons = await LessonRepo.getAllLessons({ order: ['id'] });
      res.json(lessons);
    } catch (error) {
      apiErrorHandler(error, req, res, 'Fetch All Lessons failed.');
    }
  }

  async getLessonByCourse(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const courseId = parseInt(req.params.id);
      if (isNaN(courseId)) {
        return res.status(400).json({ message: 'Invalid course ID' });
      }

      const isEnrolled = await EnrollmentRepo.isEnrolled(req.user.id, courseId);
      if (!isEnrolled && req.user.role !== 'admin') {
        return res.status(403).json({
          message: 'Forbidden: You need to enroll in this course first',
        });
      }

      const lesson = await LessonRepo.getLessonByCourse(courseId);
      res.json(lesson);
    } catch (error) {
      apiErrorHandler(
        error,
        req,
        res,
        `Lessons in course ${req.params.id} failed.`,
      );
    }
  }

  async getLessonById(req: AuthRequest, res: any, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const result = await LessonRepo.getLessonById(req.params.id);
      if (result) {
        const isEnrolled = await EnrollmentRepo.isEnrolled(
          req.user.id,
          result.courseId,
        );
        if (!isEnrolled && req.user.role !== 'admin') {
          return res.status(403).json({
            message: 'Forbidden: You need to enroll in this course first',
          });
        }
        return res.json(result);
      } else {
        res.status(404).send(`Lesson ${req.params.id} not found.`);
      }
    } catch (error) {
      apiErrorHandler(error, req, res, `Lesson ${req.params.id} failed.`);
    }
  }

  async createLesson(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await LessonRepo.createLesson(req['value']['body']);
      res.json(result);
    } catch (error) {
      apiErrorHandler(error, req, res, 'Creation of Lesson failed.');
    }
  }

  async updateLesson(req: AuthRequest, res: Response, next: NextFunction) {
    const id = parseInt(req.params.id);
    try {
      const result = await LessonRepo.updateLesson(id, req['value']['body']);
      res.json(result);
    } catch (error) {
      apiErrorHandler(
        error,
        req,
        res,
        `updation of Lesson ${req.params.id} is failed.`,
      );
    }
  }

  async deleteLesson(req: AuthRequest, res: Response, next: NextFunction) {
    const id = parseInt(req.params.id);
    try {
      const result = await LessonRepo.deleteLesson(id);
      res.json(result);
    } catch (error) {
      apiErrorHandler(
        error,
        req,
        res,
        `deletion of Lesson ${req.params.id}  is failed.`,
      );
    }
  }
}
