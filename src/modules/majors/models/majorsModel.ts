import { Model, DataTypes } from "sequelize";
import type { UUID } from "crypto";
import sequelize from "../../../config/db.js";

class Major extends Model {
  declare majorId: UUID;
  declare facultyId: UUID;
  declare title: string;
  declare description: string;
}

Major.init(
  {
    majorId: {
      type: DataTypes.UUID,
      unique: true,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    facultyId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "faculties",
        key: "facultyId",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    tableName: "Majors",
    timestamps: true,
    paranoid: true,
    indexes: [
      { unique: true, fields: ["majorId"] },
      { fields: ["facultyId", "title"] },
    ],
    sequelize,
  }
);

export default Major;
