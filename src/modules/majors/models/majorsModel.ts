import { Model, DataTypes } from "sequelize";
import type { UUID } from "crypto";
import sequelize from "../../../config/db.js";
import Faculty from "../../faculties/models/facultiesModel.js";

class Major extends Model {
  declare majorId: UUID;
  declare facultyId: UUID;
  declare title: string;
  declare description: string;
  declare createdAt: number;
  declare updatedAt: number;
  declare deletedAt: number;
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
    tableName: "majors",
    timestamps: true,
    paranoid: true,
    underscored: true,
    indexes: [
      { unique: true, fields: ["majorId"] },
      { fields: ["facultyId", "title"] },
    ],
    sequelize,
  }
);

Major.belongsTo(Faculty, { foreignKey: "facultyId" });
Faculty.hasMany(Major, { foreignKey: "facultyId" });

export default Major;
