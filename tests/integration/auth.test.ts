import { it, jest, beforeAll, afterAll, expect } from "@jest/globals";
import request from "supertest";

let mockUuidCounter = 1000;
jest.mock("uuid", () => ({
  v4: jest.fn(() => `mock-uuid-${mockUuidCounter++}`),
}));

jest.mock("nodemailer", () => ({
  createTransport: jest.fn(() => ({
    sendMail: jest.fn(() => Promise.resolve({ messageId: "message_id" })),
  })),
}));

jest.setTimeout(30000);

import app from "../../src/app.ts";
import { connectTestDb, disconnectTestDb } from "../setup/database.js";

const agent = request.agent(app);

beforeAll(async () => {
  await connectTestDb();
});

afterAll(async () => {
  await disconnectTestDb();
});

it("Testing registering a new user", async () => {
  const res = await agent.post("/api/v1/auth/register").send({
    firstName: "test",
    lastName: "test",
    email: "test@example.com",
    username: "test",
    password: "Te@123456",
    repeatPassword: "Te@123456",
    phoneNumber: "123",
    address: "123 city",
    gender: "male",
    dateOfBirth: "2000-01-01",
  });

  expect(res.statusCode).toBe(201);
  expect(res.body.success).toBe(true);
  expect(res.body.message).toBe(
    "Registration successful. Please check your email to verify your account."
  );
  expect(res.headers["set-cookie"]).toBeDefined();
});

it("Log user in", async () => {
  const res = await agent.post("/api/v1/auth/login").send({
    username: "test",
    password: "Te@123456",
  });

  expect(res.statusCode).toBe(200);
  expect(res.body.success).toBe(true);
  expect(res.body.message).toBe("Logged in successfully");
  expect(res.headers["set-cookie"]).toBeDefined();
});
