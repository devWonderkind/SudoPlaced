// src/schemas/contact.js
import * as z from 'zod';

export const contactSchema = z.object({
  first_name: z.string().min(2, { message: 'First name must be at least 2 characters.' }),
  last_name: z.string().optional(),
  company: z.string().min(2, { message: 'Company name must be at least 2 characters.' }),
  designation: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional(),
  profile_image_url: z.string().url().optional().or(z.literal('')),
  linkedin_url: z.string().url().optional().or(z.literal('')),
  x_url: z.string().url().optional().or(z.literal('')),
  context_notes: z.string().optional(),
  privacy_status: z.enum(['Private', 'Public_Pending', 'Public']).default('Private'),
});

export const defaultContactValues = {
  first_name: '',
  last_name: '',
  company: '',
  designation: '',
  email: '',
  phone: '',
  profile_image_url: '',
  linkedin_url: '',
  x_url: '',
  context_notes: '',
  privacy_status: 'Private',
};
