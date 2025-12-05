import { Model, DataTypes } from "sequelize";
import type { UUID } from "crypto";
import sequelize from "../../../config/db.js";
import Student from "../../students/models/studentsModel.js";
import Exam from "../../exams/models/examsModel.js";

class Score extends Model {
  declare scoreId: UUID;
  declare studentId: UUID;
  declare examId: UUID;
  declare score: number;
  declare notes: string;
}

Score.init(
  {
    scoreId: {
      type: DataTypes.UUID,
      primaryKey: true,
      unique: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    studentId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Students",
        key: "studentId",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    examId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Exams",
        key: "examId",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    score: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "Scores",
    timestamps: true,
    paranoid: true,
    indexes: [{ fields: ["studentId", "examId", "score"] }],
    sequelize,
  }
);

Score.belongsTo(Student, { foreignKey: "studentId" });
Student.hasMany(Score, { foreignKey: "studentId" });

Score.belongsTo(Exam, { foreignKey: "examId" });
Exam.hasMany(Score, { foreignKey: "examId" });

export default Score;
