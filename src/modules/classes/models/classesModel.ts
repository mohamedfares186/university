import { Model, DataTypes } from "sequelize";
import type { UUID } from "crypto";
import sequelize from "../../../config/db.js";
import Course from "../../courses/models/coursesModel.js";

class Classes extends Model {
  declare classId: UUID;
  declare courseId: UUID;
  declare title: string;
  declare description: string;
  declare date: Date;
  declare createdAt: number;
  declare updatedAt: number;
  declare deletedAt: number;
}

Classes.init(
  {
    classId: {
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
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    tableName: "classes",
    timestamps: true,
    paranoid: true,
    underscored: true,
    indexes: [
      { unique: true, fields: ["classId"] },
      { fields: ["title", "date"] },
    ],
    sequelize,
  }
);

Classes.belongsTo(Course, { foreignKey: "courseId" });
Course.hasMany(Classes, { foreignKey: "courseId" });

export default Classes;
