import { Model, DataTypes } from "sequelize";
import sequelize from "../../../config/db.js";
import type { UUID } from "crypto";

class Faculty extends Model {
  declare facultyId: UUID;
  declare title: string;
  declare description: string;
  declare createdAt: number;
  declare updatedAt: number;
  declare deletedAt: number;
}

Faculty.init(
  {
    facultyId: {
      type: DataTypes.UUID,
      primaryKey: true,
      unique: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
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
    tableName: "faculties",
    timestamps: true,
    paranoid: true,
    underscored: true,
    indexes: [{ unique: true, fields: ["facultyId"] }, { fields: ["title"] }],
    sequelize,
  }
);

export default Faculty;
