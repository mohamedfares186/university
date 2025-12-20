"use strict";

const { DataTypes } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("attendance", {
      attendance_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        unique: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
      student_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "students",
          key: "student_id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      class_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "classes",
          key: "class_id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("attended", "absent"),
        allowNull: false,
        defaultValue: "absent",
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      deleted_at: {
        type: DataTypes.DATE,
      },
    });
    await queryInterface.addIndex("attendance", ["status"]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("attendance");
  },
};
