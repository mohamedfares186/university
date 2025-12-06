"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("major_courses", {
      major_course_id: {
        type: Sequelize.UUID,
        primaryKey: true,
        unique: true,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
      },
      major_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "majors",
          key: "major_id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },

      course_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "courses",
          key: "course_id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      deleted_at: {
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("major_courses");
  },
};
