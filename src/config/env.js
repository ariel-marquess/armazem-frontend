import { z } from 'zod';

const envSchema = z.object({
    API_URL: z.url(),
    ENVIRONMENT: z.enum(['development', 'production']).default('development'),
});

export const env = envSchema.parse({
    API_URL: import.meta.env.VITE_API_URL,
    ENVIRONMENT: import.meta.env.VITE_ENVIRONMENT,
});