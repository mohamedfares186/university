export interface EnvType {
  env: string | undefined;
  port: number | undefined;
  frontendUrl: string | undefined;
  databaseUrl: string | undefined;
  jwtSecret: string | undefined;
  secureTokenSecret: string | undefined;
  csrfTokenSecret: string | undefined;
  emailHost?: string | undefined;
  emailPort?: number | undefined;
  emailUser?: string | undefined;
  emailPass?: string | undefined;
}
