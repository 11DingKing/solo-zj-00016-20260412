import { Course } from '../models/Course';
import { Lesson } from '../models/Lesson';

class CourseRepo {
  constructor() {}

  getAllCourses(options) {
    return Course.findAll(options);
  }

  getById(courseId) {
    return Course.findByPk(courseId, {
      include: [
        {
          model: Lesson,
          as: 'lessons',
        },
      ],
    });
  }

  createCourse(props: any) {
    return Course.create(props);
  }

  updateCourse(id: Number, props: any) {
    return Course.update(props, { where: { id: id.toString() } });
  }

  deleteCourse(id: Number) {
    return Course.destroy({ where: { id: id.toString() } });
  }
}

export default new CourseRepo();
