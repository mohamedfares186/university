import crypto from "crypto";
import { logger } from "./logger.js";
import type { JWTCredentials } from "../types/credentials.js";
import type { UserRequest } from "../types/request.js";
import type { NextFunction, Response } from "express";
import environment from "../config/env.js";

const { env, csrfTokenSecret } = environment;

const generateCsrfToken = (user: JWTCredentials) => {
  if (!csrfTokenSecret || csrfTokenSecret === undefined)
    throw new Error("Tokens configurations are not set properly");

  const userId = user.userId;
  const random = crypto.randomBytes(32).toString("hex");
  const timeStamp = Date.now();
  const hmac = crypto
    .createHmac("sha256", csrfTokenSecret as string)
    .update(`${userId}.${random}.${timeStamp}`)
    .digest("hex");

  return `${random}.${timeStamp}.${hmac}`;
};

const verifyCsrfToken = (user: JWTCredentials, token: string) => {
  const userId = user.userId;
  try {
    const tokenParts = token.split(".");
    if (tokenParts.length !== 3) {
      return false;
    }

    const [random, timeStamp, hmac] = tokenParts;

    if (!random || !timeStamp || !hmac) return false;

    const ts = Number(timeStamp);
    if (Number.isNaN(ts)) return false;

    if (Date.now() - ts > 1000 * 60 * 60) {
      return false;
    }

    const hmacToVerify = crypto
      .createHmac("sha256", csrfTokenSecret as string)
      .update(`${userId}.${random}.${timeStamp}`)
      .digest("hex");

    return crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(hmacToVerify));
  } catch (error) {
    logger.warn(`CSRF token validateion error: ${error}`);
    return false;
  }
};

const validateCsrfToken = (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers["x-csrf-token"];
    const cookieToken = req.cookies["x-csrf-token"];
    const user = req.user;

    if (!token || !cookieToken) {
      logger.warn(
        `CSRF validation failed - Missing tokens. IP: ${req.ip}, User: ${
          user?.userId || "unknown"
        }`
      );
      return res.status(403).json({ Error: "CSRF token is required" });
    }

    if (!user?.userId) {
      logger.warn(`CSRF validation failed - No userId. IP: ${req.ip}`);
      return res.status(403).json({ Error: "Forbidden" });
    }

    if (token !== cookieToken) {
      logger.warn(
        `CSRF validation failed - Token mismatch. IP: ${req.ip}, User: ${user?.userId}`
      );
      return res.status(403).json({ Error: "Invalid CSRF token" });
    }

    if (!verifyCsrfToken(user as JWTCredentials, token as string)) {
      logger.warn(
        `CSRF validation failed - Invalid token. IP: ${req.ip}, User: ${user?.userId}`
      );
      return res.status(403).json({ Error: "Invalid CSRF token" });
    }

    const rotateToken = generateCsrfToken(user as JWTCredentials);
    res.cookie("x-csrf-token", rotateToken, {
      httpOnly: true,
      secure: env === "production",
      sameSite: "strict",
      maxAge: 1000 * 60 * 60,
    });
    res.setHeader("x-csrf-token", rotateToken);

    return next();
  } catch (error) {
    logger.warn(`CSRF middleware error: ${error}`);
    return res.status(500).json({ Error: "Internal server error" });
  }
};

export { generateCsrfToken, validateCsrfToken };
