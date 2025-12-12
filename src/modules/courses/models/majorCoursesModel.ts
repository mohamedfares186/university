import { Model, DataTypes } from "sequelize";
import type { UUID } from "crypto";
import sequelize from "../../../config/db.js";
import Major from "../../majors/models/majorsModel.js";
import Course from "./coursesModel.js";

class MajorCourse extends Model {
  declare majorCourseId: UUID;
  declare majorId: UUID;
  declare courseId: UUID;
  declare createdAt: number;
  declare updatedAt: number;
  declare deletedAt: number;
}

MajorCourse.init(
  {
    majorCourseId: {
      type: DataTypes.UUID,
      primaryKey: true,
      unique: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    majorId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "majors",
        key: "majorId",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },

    courseId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "courses",
        key: "courseId",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
  },
  {
    tableName: "major_courses",
    timestamps: true,
    paranoid: true,
    underscored: true,
    indexes: [{ unique: true, fields: ["majorId", "courseId"] }],
    sequelize,
  }
);

Major.belongsToMany(Course, { through: MajorCourse });
Course.belongsToMany(Major, { through: MajorCourse });

export default MajorCourse;
