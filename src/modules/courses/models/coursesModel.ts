import { Model, DataTypes } from "sequelize";
import type { UUID } from "crypto";
import sequelize from "../../../config/db.js";

class Course extends Model {
  declare courseId: UUID;
  declare title: string;
  declare description: string;
  declare creditHours: number;
  declare createdAt: number;
  declare updatedAt: number;
  declare deletedAt: number;
}

Course.init(
  {
    courseId: {
      type: DataTypes.UUID,
      primaryKey: true,
      unique: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    creditHours: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "courses",
    timestamps: true,
    paranoid: true,
    underscored: true,
    indexes: [{ unique: true, fields: ["courseId"] }, { fields: ["title"] }],
    sequelize,
  }
);

export default Course;
