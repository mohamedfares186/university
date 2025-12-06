"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("scores", {
      score_id: {
        type: Sequelize.UUID,
        primaryKey: true,
        unique: true,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
      },
      student_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "students",
          key: "student_id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      exam_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "exams",
          key: "exam_id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      score: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true,
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
    await queryInterface.addIndex("scores", ["score"]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("scores");
  },
};
