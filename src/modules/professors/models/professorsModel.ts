import { Model, DataTypes } from "sequelize";
import type { UUID } from "crypto";
import sequelize from "../../../config/db.js";
import User from "../../users/models/users.js";
import Course from "../../courses/models/coursesModel.js";

class Professor extends Model {
  declare professorId: UUID;
  declare userId: UUID;
  declare courseId: UUID;
  declare title: string;
  declare createdAt: number;
  declare updatedAt: number;
  declare deletedAt: number;
}

Professor.init(
  {
    professorId: {
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
    title: {
      type: DataTypes.ENUM("professor", "teaching_assistant"),
      allowNull: false,
    },
  },
  {
    tableName: "professors",
    timestamps: true,
    paranoid: true,
    underscored: true,
    indexes: [{ unique: true, fields: ["professorId"] }, { fields: ["title"] }],
    sequelize,
  }
);

Professor.belongsTo(User, { foreignKey: "userId" });
User.hasMany(Professor, { foreignKey: "userId" });

Professor.belongsTo(Course, { foreignKey: "courseId" });
Course.hasMany(Professor, { foreignKey: "courseId" });

export default Professor;
