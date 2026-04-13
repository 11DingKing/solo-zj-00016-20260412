import { Request, Response, NextFunction } from 'express';
import CourseRepo from './../repositories/CoursesRepo';
import EnrollmentRepo from './../repositories/EnrollmentRepo';
import { apiErrorHandler } from './../handlers/errorHandler';
import { AuthRequest } from './../middlewares/auth';

export default class CoursesCtrl {
  constructor() {}

  async getAllCourses(req: Request, res: Response, next: NextFunction) {
    try {
      const courseList = await CourseRepo.getAllCourses({ order: ['seqNo'] });

      const coursesWithEnrollmentCount = await Promise.all(
        courseList.map(async (course: any) => {
          const enrollmentCount = await EnrollmentRepo.getEnrollmentCount(
            course.id,
          );
          return {
            ...course.toJSON(),
            enrollmentCount,
          };
        }),
      );

      res.json(coursesWithEnrollmentCount);
    } catch (error) {
      apiErrorHandler(error, req, res, 'Fetch All Courses failed.');
    }
  }

  async getCourseDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const courseDetails = await CourseRepo.getById(req.params.id);
      if (courseDetails) {
        const enrollmentCount = await EnrollmentRepo.getEnrollmentCount(
          courseDetails.id,
        );
        const courseWithEnrollmentCount = {
          ...courseDetails.toJSON(),
          enrollmentCount,
        };
        return res.json(courseWithEnrollmentCount);
      } else {
        res.status(404).send(`Course ${req.params.id} not found.`);
      }
    } catch (error) {
      apiErrorHandler(error, req, res, `Course ${req.params.id} is failed.`);
    }
  }

  async createCourse(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await CourseRepo.createCourse(req.body);
      res.json(result);
    } catch (error) {
      apiErrorHandler(error, req, res, 'Creation of Course failed.');
    }
  }

  async updateCourse(req: AuthRequest, res: Response, next: NextFunction) {
    const id = parseInt(req.params.id);
    try {
      const result = await CourseRepo.updateCourse(id, req.body);
      res.json(result);
    } catch (error) {
      apiErrorHandler(
        error,
        req,
        res,
        `updation of Course ${req.params.id} is failed.`,
      );
    }
  }

  async deleteCourse(req: AuthRequest, res: Response, next: NextFunction) {
    const id = parseInt(req.params.id);
    try {
      const result = await CourseRepo.deleteCourse(id);
      res.json(result);
    } catch (error) {
      apiErrorHandler(
        error,
        req,
        res,
        `deletion of Course ${req.params.id}  is failed.`,
      );
    }
  }
}
