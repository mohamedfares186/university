"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("students", {
      student_id: {
        type: Sequelize.UUID,
        primaryKey: true,
        unique: true,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "user_id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
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
      gpa: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      semester: {
        type: Sequelize.STRING,
        allowNull: false,
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
    await queryInterface.addIndex("students", ["gpa"]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("students");
  },
};
