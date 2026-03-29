import { z } from "zod";

const envSchema = z
  .object({
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    DATABASE_URL: z.string().optional(),
    OPENROUTER_API_KEY: z.string().optional(),
    OPENROUTER_MODEL: z.string().default("google/gemini-3-flash-preview"),
    JWT_SECRET: z.string().optional(),
    TAM_DATA_BACKEND: z.enum(["memory", "postgres"]).default("postgres"),
    TAM_AI_MODE: z.enum(["mock", "openrouter"]).default("openrouter"),
    RESEND_API_KEY: z.string().optional(),
    RESEND_FROM_EMAIL: z.string().optional(),
    BLOB_READ_WRITE_TOKEN: z.string().optional(),
  })
  .transform((raw) => ({
    ...raw,
    JWT_SECRET: raw.JWT_SECRET ?? "tam-dev-jwt-secret-change-me",
    RESEND_FROM_EMAIL: raw.RESEND_FROM_EMAIL ?? "onboarding@resend.dev",
  }))
  .superRefine((env, ctx) => {
    if (env.TAM_DATA_BACKEND === "postgres" && !env.DATABASE_URL) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["DATABASE_URL"],
        message: "DATABASE_URL is required when TAM_DATA_BACKEND=postgres",
      });
    }

    if (env.TAM_AI_MODE === "openrouter" && !env.OPENROUTER_API_KEY) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["OPENROUTER_API_KEY"],
        message: "OPENROUTER_API_KEY is required when TAM_AI_MODE=openrouter",
      });
    }
  });

export type AppEnv = z.infer<typeof envSchema>;

let cachedEnv: AppEnv | null = null;

export function getEnv() {
  if (!cachedEnv) {
    cachedEnv = envSchema.parse(process.env);
  }

  return cachedEnv;
}

export function resetEnvCache() {
  cachedEnv = null;
}

export const env = new Proxy({} as AppEnv, {
  get(_target, property) {
    return getEnv()[property as keyof AppEnv];
  },
  has(_target, property) {
    return property in getEnv();
  },
  ownKeys() {
    return Reflect.ownKeys(getEnv());
  },
  getOwnPropertyDescriptor() {
    return {
      configurable: true,
      enumerable: true,
    };
  },
});
