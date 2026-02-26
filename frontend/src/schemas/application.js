import { z } from "zod";

export const applicationSchema = z.object({
  role_title: z.string().min(1, "Role title is required"),
  company_name: z.string().min(1, "Company name is required"),
  company_logo: z.string().url("Invalid URL").optional().or(z.literal("")),
  job_url: z.string().url("Invalid URL").optional().or(z.literal("")),
  location: z.string().optional(),
  work_mode: z.enum(["Remote", "Hybrid", "On-site", ""]).optional(),
  expected_salary: z.string().optional(),
  status: z.coerce.number().int().optional().nullable(), // status ID
  priority_order: z.number().int().default(0),
  reminder_duration_days: z.coerce.number().int().default(0),
  interview_date: z.string().optional().nullable(),
  applied_on: z.string().optional().nullable(),
  hr_contact_ids: z.array(z.number()).optional(),
});
