import * as zod from "zod";

export const signinSchema = zod.object({
  email: zod.string().email(),
  password: zod.string().min(8),
});

export type SigninType = zod.infer<typeof signinSchema>;

export const signupSchema = zod.object({
  email: zod.string().email(),
  password: zod.string().min(8),
  name: zod.string().min(3),
});

export type SignupType = zod.infer<typeof signupSchema>;
