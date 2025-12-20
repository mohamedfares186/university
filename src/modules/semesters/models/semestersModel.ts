import { Model, DataTypes } from "sequelize";
import type { UUID } from "crypto";
import sequelize from "../../../config/db.js";

class Semester extends Model {
  declare semesterId: UUID;
  declare title: string;
  declare startsAt: Date;
  declare endsAt: Date;
  declare isActive: boolean;
  declare createdAt: number;
  declare updatedAt: number;
  declare deletedAt: number;
}

Semester.init(
  {
    semesterId: {
      type: DataTypes.UUID,
      unique: true,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    startsAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endsAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    tableName: "semesters",
    timestamps: true,
    paranoid: true,
    underscored: true,
    indexes: [{ fields: ["title"] }],
    sequelize,
  }
);

export default Semester;
