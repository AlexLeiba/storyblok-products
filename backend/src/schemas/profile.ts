import * as zod from "zod";

export const updateProfileSchema = zod.object({
  name: zod.string().trim().min(1, "Name is required").optional(),

  password: zod
    .string()
    .trim()
    .min(8, "Password must be at least 8 characters")
    .optional(),

  currency: zod.string().optional(),
});
