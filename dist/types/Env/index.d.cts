import { z } from 'zod';

declare const Environment: z.ZodDefault<z.ZodEnum<{
    local: "local";
    development: "development";
    production: "production";
}>>;
type Environment = z.infer<typeof Environment>;

export { Environment };
