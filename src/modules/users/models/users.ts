import { Model, DataTypes } from "sequelize";
import sequelize from "../../../config/db.js";
import type { UUID } from "crypto";

class User extends Model {
  declare userId: UUID;
  declare firstName: string;
  declare lastName: string;
  declare email: string;
  declare username: string;
  declare password: string;
  declare dateOfBirth: Date;
  declare gender: string;
  declare address: string;
  declare phoneNumber: string;
  declare role: string;
  declare isVerified: boolean;
  declare isBanned: boolean;
  declare isApproved: boolean;
  declare createdAt: number;
  declare updatedAt: number;
  declare deletedAt: number;
}

User.init(
  {
    userId: {
      type: DataTypes.UUID,
      primaryKey: true,
      unique: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dateOfBirth: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    isBanned: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    isApproved: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    role: {
      type: DataTypes.ENUM(
        "student",
        "professor",
        "teaching_assistant",
        "moderator",
        "admin",
        "super_admin"
      ),
      allowNull: false,
      defaultValue: "student",
    },
  },
  {
    tableName: "users",
    timestamps: true,
    paranoid: true,
    underscored: true,
    defaultScope: {
      attributes: { exclude: ["password"] },
    },
    indexes: [{ unique: true, fields: ["userId", "email", "username"] }],
    sequelize,
  }
);

export default User;
