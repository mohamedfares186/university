import { Model, DataTypes } from "sequelize";
import type { UUID } from "crypto";
import sequelize from "../../../config/db.js";
import Student from "../../students/models/studentsModel.js";
import Major from "../../majors/models/majorsModel.js";

class Enrollment extends Model {
  declare enrollmentId: UUID;
  declare studentId: UUID;
  declare majorId: UUID;
  declare createdAt: number;
  declare updatedAt: number;
  declare deletedAt: number;
}

Enrollment.init(
  {
    enrollmentId: {
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
        model: "students",
        key: "studentId",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
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
  },
  {
    tableName: "enrollments",
    timestamps: true,
    paranoid: true,
    underscored: true,
    indexes: [
      { unique: true, fields: ["enrollmentId"] },
      { fields: ["studentId"] },
    ],
    sequelize,
  }
);

Enrollment.belongsTo(Student, { foreignKey: "studentId" });
Student.hasMany(Enrollment, { foreignKey: "studentId" });

Enrollment.belongsTo(Major, { foreignKey: "majorId" });
Major.hasMany(Enrollment, { foreignKey: "majorId" });

export default Enrollment;
