import type { UUIDTypes } from "uuid";

export interface RegisterCredentials {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  repeatPassword?: string;
  dateOfBirth: Date;
  phoneNumber: string;
  address: string;
  gender: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface UserCredentials extends RegisterCredentials {
  userId: UUIDTypes;
  isVerified: boolean;
  isBanned: boolean;
  isApproved: boolean;
  role: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface AdminUserCredentials {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  phoneNumber: string;
  address: string;
  gender: string;
  dateOfBirth: Date;
}

export interface CreateUserCredentials extends RegisterCredentials {
  role: string;
  majorId?: string;
  courseId?: string;
  professorTitle?: string;
  isVerified: boolean;
  isApproved: boolean;
  isBanned: boolean;
}

export interface ResetPasswordCredentials {
  password: string;
  repeatPassword: string;
}

export interface JWTCredentials {
  userId: UUIDTypes;
  role: string;
  isVerified: boolean;
  isBanned: boolean;
  isApproved: boolean;
}
