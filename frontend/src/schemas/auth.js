import { z } from "zod";

// Base fields used in both
const email = z.string().email("Invalid email address");
const password = z.string().min(8, "Password must be at least 8 characters");

export const LoginSchema = z.object({
  email,
  password,
});

export const SignupSchema = z.object({
  full_name: z.string().min(2, "Full name is required"),
  email,
  password,
  re_password: z.string(),
}).refine((data) => data.password === data.re_password, {
  message: "Passwords don't match",
  path: ["re_password"],
});