import type { Request, Response } from "express";
import type { JwtPayload } from "jsonwebtoken";
import type { UUIDTypes } from "uuid";

export interface UserRequest extends Request {
  user?:
    | {
        userId: UUIDTypes;
        role: string;
        isVerified: boolean;
        isBanned: boolean;
        isApproved: boolean;
      }
    | JwtPayload;
}

export interface UserResponse extends Response {
  message: string;
}

export interface ResponseError extends Error {
  statusCode: number;
  status: string;
}
