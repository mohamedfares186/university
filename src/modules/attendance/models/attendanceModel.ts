import { Model, DataTypes } from "sequelize";
import sequelize from "../../../config/db.js";
import type { UUID } from "crypto";
import Student from "../../students/models/studentsModel.js";
import Classes from "../../classes/models/classesModel.js";

class Attendance extends Model {
  declare attendanceId: UUID;
  declare studentId: UUID;
  declare classId: UUID;
  declare date: Date;
  declare status: string;
  declare createdAt: number;
  declare updatedAt: number;
  declare deletedAt: number;
}

Attendance.init(
  {
    attendanceId: {
      type: DataTypes.UUID,
      primaryKey: true,
      unique: true,
      allowNull: true,
      defaultValue: DataTypes.UUIDV4,
    },
    studentId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "students",
        key: "student_id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    classId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "classes",
        key: "class_id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("attended", "absent"),
      allowNull: false,
      defaultValue: "absent",
    },
  },
  {
    tableName: "attendance",
    timestamps: true,
    paranoid: true,
    underscored: true,
    indexes: [{ fields: ["status"] }],
    sequelize,
  }
);

Attendance.belongsTo(Student, { foreignKey: "student_id" });
Student.hasMany(Attendance, { foreignKey: "student_id" });

Attendance.belongsTo(Classes, { foreignKey: "class_id" });
Classes.hasMany(Attendance, { foreignKey: "class_id" });

export default Attendance;
