import { Model, DataTypes } from 'sequelize';
import { sequelize } from './../db/db';
import { User } from './User';
import { Course } from './Course';

export class Enrollment extends Model {
  public id!: number;
  public userId!: number;
  public courseId!: number;
}

Enrollment.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    courseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Course,
        key: 'id',
      },
    },
  },
  {
    sequelize,
    tableName: 'Enrollments',
    indexes: [
      {
        unique: true,
        fields: ['userId', 'courseId'],
      },
    ],
  },
);

User.belongsToMany(Course, {
  through: Enrollment,
  foreignKey: 'userId',
  as: 'enrolledCourses',
});
Course.belongsToMany(User, {
  through: Enrollment,
  foreignKey: 'courseId',
  as: 'enrolledUsers',
});
