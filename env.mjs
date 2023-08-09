import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(['development', 'test', 'production']),
    DEPLOY_GROUP: z.enum(['development', 'local', 'production']),
    NEXTAUTH_URL: z.preprocess(
      // This makes Vercel deployments not fail if you don't set NEXTAUTH_URL
      // Since NextAuth.js automatically uses the VERCEL_URL if present.
      (str) => process.env.VERCEL_URL ?? str,
      // VERCEL_URL doesn't include `https` so it cant be validated as a URL
      process.env.VERCEL ? z.string() : z.string().url(),
    ),
    NEXTAUTH_SECRET: z.string().min(1),
    AWS_SST_NAME:
      process.env.NODE_ENV === 'production'
        ? z.string().min(1)
        : z.string().optional(),
    AWS_SST_ID:
      process.env.NODE_ENV === 'production'
        ? z.string().min(1)
        : z.string().optional(),
    AWS_SST_STAGE:
      process.env.NODE_ENV === 'production'
        ? z.string().min(1)
        : z.string().optional(),
    AWS_REGION:
      process.env.NODE_ENV === 'production'
        ? z.string().min(1)
        : z.string().optional(),
    AWS_ACCESS_KEY_ID:
      process.env.NODE_ENV === 'production'
        ? z.string().min(1)
        : z.string().optional(),
    AWS_SECRET_ACCESS_KEY:
      process.env.NODE_ENV === 'production'
        ? z.string().min(1)
        : z.string().optional(),
    AWS_S3_BUCKET:
      process.env.NODE_ENV === 'production'
        ? z.string().min(1)
        : z.string().optional(),
    AWS_CLOUD_FRONT_DISTRIBUTION_ID: z.string().optional(),
    SENTRY_DSN:
      process.env.NODE_ENV === 'production'
        ? z.string().url().min(1)
        : z.string().optional(),
    DATABASE_URL:
      process.env.NODE_ENV === 'production'
        ? z.string().min(1)
        : z.string().optional(),
    GITHUB_CLIENT_ID: z.string().min(1),
    GITHUB_CLIENT_SECRET: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_SITE_URL: z.string().optional(),
    NEXT_PUBLIC_API_HOST: z.string().optional(),
    NEXT_PUBLIC_DEPLOY_GROUP: z.enum(['development', 'local', 'production']),
    NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional(),
  },
  runtimeEnv: {
    // server
    NODE_ENV: process.env.NODE_ENV,
    DEPLOY_GROUP: process.env.DEPLOY_GROUP,
    AWS_SST_NAME: process.env.AWS_SST_NAME,
    AWS_SST_ID: process.env.AWS_SST_ID,
    AWS_SST_STAGE: process.env.AWS_SST_STAGE,
    AWS_REGION: process.env.AWS_REGION,
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    AWS_S3_BUCKET: process.env.AWS_S3_BUCKET,
    AWS_CLOUD_FRONT_DISTRIBUTION_ID:
      process.env.AWS_CLOUD_FRONT_DISTRIBUTION_ID,
    SENTRY_DSN: process.env.SENTRY_DSN,
    DATABASE_URL: process.env.DATABASE_URL,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    // client
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_API_HOST: process.env.NEXT_PUBLIC_API_HOST,
    NEXT_PUBLIC_DEPLOY_GROUP: process.env.NEXT_PUBLIC_DEPLOY_GROUP,
  },
});
