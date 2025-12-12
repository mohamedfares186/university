import sequelize from "../../../config/db.js";
import { DataTypes, Model } from "sequelize";
import type { UUID } from "crypto";
import User from "./users.js";

class Session extends Model {
  declare sessionId: UUID;
  declare userId: UUID;
  declare token: string;
  declare expiresAt: Date;
  declare isRevoked: boolean;
  declare createdAt: number;
  declare updatedAt: number;
  declare deletedAt: number;
}

Session.init(
  {
    sessionId: {
      type: DataTypes.UUID,
      primaryKey: true,
      unique: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: "users", key: "userId" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    isRevoked: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    tableName: "sessions",
    timestamps: true,
    paranoid: true,
    underscored: true,
    indexes: [{ unique: true, fields: ["token"] }, { fields: ["userId"] }],
    sequelize,
  }
);

User.hasMany(Session, {
  foreignKey: "userId",
});

Session.belongsTo(User, {
  foreignKey: "userId",
});

export default Session;
