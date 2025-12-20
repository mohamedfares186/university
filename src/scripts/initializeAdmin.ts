import readline from "readline";
import { logger } from "../middleware/logger.js";
import { v4 as uuidv4 } from "uuid";
import { User } from "../models/index.js";
import type { AdminUserCredentials } from "../types/credentials.js";
import bcrypt from "bcryptjs";

class AdminUser {
  constructor(
    protected rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    })
  ) {
    this.rl = rl;
  }
  async prompt(question: string): Promise<string> {
    return new Promise((res) => {
      this.rl.question(question, res);
    });
  }

  validateEmail(email: string): boolean {
    const emailRegex = /^\S+@\S+\.\S+$/;
    return emailRegex.test(email);
  }

  validateUsername(username: string): boolean {
    if (username.length < 4)
      logger.error("Username can't be less than 4 characters");
    const usernameRegex = /^[A-Za-z0-9_]+$/;
    return usernameRegex.test(username);
  }

  validatePassword(password: string): boolean {
    if (password.length < 8)
      logger.error("password must be at least 8 characters long");
    const passwordRegex =
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
    return passwordRegex.test(password);
  }
  validateDate(date: string): boolean {
    const dateRegex = /^(?:\d{4})-(?:\d{2})-(?:\d{2})/;
    return dateRegex.test(date);
  }

  // validatePhoneNumber(phoneNumber: string): boolean {}
  // validategender(userGender: string): boolean {}
  // validateAddress(userAddress: string): boolean {}

  async AdminCredentials() {
    logger.info(`=====================\n`);
    logger.info(`Initialize Admin User\n`);
    logger.info(`=====================\n`);

    let firstName,
      lastName,
      email,
      username,
      password,
      repeatPassword,
      dateOfBirth,
      phoneNumber,
      gender,
      address;

    while (true) {
      firstName = (await this.prompt(`Admin first name: `)).trim();
      lastName = (await this.prompt(`Admin last name: `)).trim();
      break;
    }

    while (true) {
      email = (await this.prompt(`Enter Admin Email: `)).trim().toLowerCase();
      const validate = this.validateEmail(email);
      if (validate === false) {
        logger.error("Invalid Email format");
        continue;
      }

      const checkUser = await User.findOne({ where: { email } });

      if (checkUser) {
        logger.error("Email is not available");
        continue;
      }
      break;
    }

    while (true) {
      username = (await this.prompt(`Enter Admin Username: `))
        .trim()
        .toLowerCase();
      const validate = this.validateUsername(username);
      if (validate === false) {
        logger.error("Invalid Username format");
        logger.warn(
          "Username can only contain laters, numbers, and underscore"
        );
        continue;
      }

      const checkUser = await User.findOne({ where: { username } });

      if (checkUser) {
        logger.error("Username is not available");
        continue;
      }
      break;
    }

    while (true) {
      password = await this.prompt(`Enter Admin Password: `);
      const validate = this.validatePassword(password);

      if (validate === false) {
        logger.error(
          `Password must include at least one letter, one number and one special character`
        );
        continue;
      }

      break;
    }

    while (true) {
      repeatPassword = await this.prompt(`Confirm password: `);
      if (repeatPassword !== password) {
        logger.error(`passwords doesn't match`);
        continue;
      }
      break;
    }
    while (true) {
      phoneNumber = await this.prompt(`Phone Number: `);
      break;
    }
    while (true) {
      address = await this.prompt(`Address: `);
      break;
    }
    while (true) {
      gender = await this.prompt(`Gender: `);
      break;
    }
    while (true) {
      dateOfBirth = await this.prompt(`Date of birth: `);
      const validate = this.validateDate(dateOfBirth);
      if (!validate) {
        logger.error(`Invalid Date Format`);
        continue;
      }
      break;
    }
    return {
      firstName,
      lastName,
      email,
      username,
      password,
      dateOfBirth,
      phoneNumber,
      address,
      gender,
    };
  }

  async SaveAdminCredentials(credentials: AdminUserCredentials) {
    logger.info(`Saving admin credentials...`);

    const superAdmin = "super_admin";

    const userId = uuidv4();

    const passwordHash = await bcrypt.hash(credentials.password, 12);

    const adminUser = await User.create({
      userId,
      firstName: credentials.firstName,
      lastName: credentials.lastName,
      email: credentials.email,
      username: credentials.username,
      password: passwordHash,
      role: superAdmin,
      address: credentials.address,
      phoneNumber: credentials.phoneNumber,
      gender: credentials.gender,
      dateOfBirth: credentials.dateOfBirth as Date,
      isVerified: true,
      isBanned: false,
      isApproved: true,
    });

    if (!adminUser) throw new Error("Something went wrong");

    logger.info(`Admin user has been created successfully`);
  }

  async Run() {
    try {
      try {
        const superAdmin = await User.findOne({
          where: { role: "super_admin" },
        });
        if (superAdmin) {
          logger.error("Super admin has been already initialized");
          process.exit(-1);
        }
      } catch (error) {
        logger.error(`Error fetching super admin data - ${error}`);
      }

      const {
        firstName,
        lastName,
        email,
        username,
        password,
        phoneNumber,
        address,
        gender,
        dateOfBirth,
      } = await this.AdminCredentials();
      return await this.SaveAdminCredentials({
        firstName,
        lastName,
        email,
        username,
        password: password as string,
        dateOfBirth: new Date(dateOfBirth),
        phoneNumber,
        address,
        gender,
      });
    } catch (error) {
      logger.error(`Error initiating Admin user - ${error}`);
      process.exit(1);
    } finally {
      this.rl.close();
    }
  }
}

export default AdminUser;
