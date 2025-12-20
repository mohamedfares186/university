import { Model, DataTypes } from "sequelize";
import type { UUID } from "crypto";
import sequelize from "../../../config/db.js";
import Course from "../../courses/models/coursesModel.js";

class Exam extends Model {
  declare examId: UUID;
  declare courseId: UUID;
  declare createdAt: number;
  declare updatedAt: number;
  declare deletedAt: number;
}

Exam.init(
  {
    examId: {
      type: DataTypes.UUID,
      primaryKey: true,
      unique: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
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
    tableName: "exams",
    timestamps: true,
    paranoid: true,
    underscored: true,
    indexes: [{ unique: true, fields: ["examId"] }, { fields: ["courseId"] }],
    sequelize,
  }
);

Exam.belongsTo(Course, { foreignKey: "courseId" });
Course.hasMany(Exam, { foreignKey: "courseId" });

export default Exam;
