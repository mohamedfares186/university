import { Model, DataTypes } from "sequelize";
import type { UUID } from "crypto";
import sequelize from "../../../config/db.js";

class Exam extends Model {
  declare examId: UUID;
  declare courseId: UUID;
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
        model: "Courses",
        key: "courseId",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
  },
  {
    tableName: "Exams",
    timestamps: true,
    paranoid: true,
    indexes: [{ unique: true, fields: ["examId"] }, { fields: ["courseId"] }],
    sequelize,
  }
);

export default Exam;
