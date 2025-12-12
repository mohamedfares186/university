import { Model, DataTypes } from "sequelize";
import type { UUID } from "crypto";
import sequelize from "../../../config/db.js";
import User from "../../users/models/users.js";
import Major from "../../majors/models/majorsModel.js";

class Student extends Model {
  declare studentId: UUID;
  declare userId: UUID;
  declare majorId: UUID;
  declare gpa: number;
  declare semester: string;
  declare createdAt: number;
  declare updatedAt: number;
  declare deletedAt: number;
}

Student.init(
  {
    studentId: {
      type: DataTypes.UUID,
      primaryKey: true,
      unique: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "userId",
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
    gpa: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    semester: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "students",
    timestamps: true,
    paranoid: true,
    underscored: true,
    indexes: [
      { unique: true, fields: ["studentId"] },
      { fields: ["majorId", "gpa"] },
    ],
    sequelize,
  }
);

Student.belongsTo(User, { foreignKey: "userId" });
User.hasMany(Student, { foreignKey: "userId" });

Student.belongsTo(Major, { foreignKey: "majorId" });
Major.hasMany(Student, { foreignKey: "majorId" });

export default Student;
