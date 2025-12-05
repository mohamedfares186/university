import type { EnvType } from "../types/env.js";

const environment: EnvType = {
  env: (process.env.NODE_ENV as unknown as string) || "local",
  port: (process.env.PORT as unknown as number) || 7000,
  frontendUrl:
    (process.env.FRONTEND_URL as unknown as string) || "http://localhost:7000",
  databaseUrl: process.env.DATABASE_URL as unknown as string,
  jwtSecret: process.env.JWT_SECRET as unknown as string,
  secureTokenSecret: process.env.SECURE_TOKEN_SECRET as unknown as string,
  csrfTokenSecret: process.env.CSRF_TOKEN_SECRET as unknown as string,
  emailHost: process.env.EMAIL_HOST as unknown as string,
  emailPort: process.env.EMAIL_PORT as unknown as number,
  emailUser: process.env.EMAIL_USER as unknown as string,
  emailPass: process.env.EMAIL_PASS as unknown as string,
};

export default environment;
