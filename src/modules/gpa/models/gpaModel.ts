import { Model, DataTypes } from "sequelize";
import type { UUID } from "crypto";
import sequelize from "../../../config/db.js";
import User from "../../users/models/users.js";

class GPA extends Model {
  declare gpaId: UUID;
  declare studentId: UUID;
  declare semesterId: UUID;
  declare gpa: number;
  declare createdAt: number;
  declare updatedAt: number;
  declare deletedAt: number;
}

GPA.init(
  {
    gpaId: {
      type: DataTypes.UUID,
      unique: true,
      allowNull: false,
      primaryKey: true,
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
    gpa: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
  },
  {
    tableName: "semesters",
    timestamps: true,
    paranoid: true,
    underscored: true,
    indexes: [{ fields: ["gpa"] }],
    sequelize,
  }
);

GPA.belongsTo(User, { foreignKey: "student_id" });
User.hasOne(GPA, { foreignKey: "student_id" });

export default GPA;
