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

export const ForgotPasswordSchema = z.object({
  email,
});

export const ResetPasswordConfirmSchema = z
  .object({
    new_password: password,
    re_new_password: z.string(),
  })
  .refine((data) => data.new_password === data.re_new_password, {
    message: "Passwords don't match",
    path: ["re_new_password"],
  });

export const ChangePasswordSchema = z
  .object({
    current_password: z.string().min(1, "Current password is required"),
    new_password: password,
    re_new_password: z.string(),
  })
  .refine((data) => data.new_password === data.re_new_password, {
    message: "Passwords don't match",
    path: ["re_new_password"],
  });

// For Google-only users who have no password yet
export const SetInitialPasswordSchema = z
  .object({
    new_password: password,
    re_new_password: z.string(),
  })
  .refine((data) => data.new_password === data.re_new_password, {
    message: "Passwords don't match",
    path: ["re_new_password"],
  });
