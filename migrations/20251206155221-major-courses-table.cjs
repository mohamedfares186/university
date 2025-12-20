"use strict";

const { DataTypes } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("major_courses", {
      major_course_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        unique: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
      major_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "majors",
          key: "major_id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },

      course_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "courses",
          key: "course_id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
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
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("major_courses");
  },
};
