import { z } from "zod"

export const Environment = z.enum(["local", "development", "production"]).default("development")
export type Environment = z.infer<typeof Environment>
