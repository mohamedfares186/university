"use strict";
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await queryInterface.bulkInsert(
      "users",
      [
        {
          user_id: uuidv4(),
          first_name: "user",
          last_name: "user",
          email: "user@example.com",
          username: "user",
          password: await bcrypt.hash("p@ssw0rd", 12),
          phone_number: "123",
          address: "123 city",
          gender: "male",
          date_of_birth: "2000-01-01",
          role: "student",
          is_verified: true,
          is_banned: false,
          is_approved: true,
          created_at: new Date(),
          updated_at: new Date(),
          deleted_at: null,
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("users", null, {});
  },
};
