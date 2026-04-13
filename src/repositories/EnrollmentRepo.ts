import { Enrollment } from '../models/Enrollment';
import { Course } from '../models/Course';
import { User } from '../models/User';
import { Op } from 'sequelize';

class EnrollmentRepo {
  constructor() {}

  async enroll(userId: number, courseId: number) {
    return Enrollment.create({ userId, courseId });
  }

  async isEnrolled(userId: number, courseId: number): Promise<boolean> {
    const enrollment = await Enrollment.findOne({
      where: { userId, courseId },
    });
    return !!enrollment;
  }

  async getEnrollmentCount(courseId: number): Promise<number> {
    return Enrollment.count({
      where: { courseId },
    });
  }

  async getEnrollmentsByUser(userId: number) {
    return Enrollment.findAll({
      where: { userId },
      include: [
        {
          model: Course,
          as: 'course',
        },
      ],
    });
  }

  async getEnrollmentsByCourse(courseId: number) {
    return Enrollment.findAll({
      where: { courseId },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'email'],
        },
      ],
    });
  }
}

export default new EnrollmentRepo();
