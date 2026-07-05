import * as zod from "zod";

export const signupSchema = zod.object({
  email: zod.string().email().min(1, "Email is required"),
  password: zod
    .string()
    .trim()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d).+$/,
      "Password must contain at least one letter and one number",
    ),
  name: zod.string().trim().min(2, "Name must be at least 2 characters"),
  currency: zod.string().default("EUR").optional(),
});
export const signinSchema = zod.object({
  email: zod.string().trim().email().min(1, "Email is required"),
  password: zod
    .string()
    .trim()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d).+$/,
      "Password must contain at least one letter and one number",
    ),
});

export const resetPasswordSendOtpSchema = zod.object({
  otpCode: zod.coerce.number().min(100000).max(999999),
  email: zod.string().email().min(1, "Email is required"),
});
export const resetPasswordSchema = zod.object({
  email: zod.string().email().min(1, "Email is required"),
  newPassword: zod
    .string()
    .trim()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d).+$/,
      "Password must contain at least one letter and one number",
    ),
});

export const verifyEmailSchema = zod.object({
  email: zod.string().email().min(1, "Email is required"),
});

export const tokenPayloadSchema = zod.object({
  userId: zod.string().min(1, "UserId is required"),
});
