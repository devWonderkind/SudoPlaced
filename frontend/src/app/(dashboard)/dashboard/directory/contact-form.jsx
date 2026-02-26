"use client";

import React from "react";
import { contactSchema, defaultContactValues } from "@/schemas/contact";
import { FormBuilder } from "@/components/shared/form-builder";

export function ContactFormBuilder({ defaultValues, onSubmit, isSubmitting }) {

  const fields = [
    { name: "first_name", label: "First Name", placeholder: "John", colSpan: 1 },
    { name: "last_name", label: "Last Name", placeholder: "Doe", colSpan: 1 },
    
    { name: "company", label: "Company", placeholder: "Tech Inc", colSpan: 1 },
    { name: "designation", label: "Role/Designation", placeholder: "Recruiter", colSpan: 1 },
    
    { name: "email", label: "Email", type: "email", placeholder: "john@company.com", colSpan: 1 },
    { name: "phone", label: "Phone", type: "tel", placeholder: "+1234567890", colSpan: 1 },
    
    { name: "linkedin_url", label: "LinkedIn URL", type: "url", placeholder: "https://linkedin.com/in/...", colSpan: 1 },
    { name: "x_url", label: "X (Twitter) URL", type: "url", placeholder: "https://x.com/...", colSpan: 1 },
    
    { name: "profile_image_url", label: "Profile Image URL", type: "url", placeholder: "https://..." , colSpan: 2 },
    
    { name: "context_notes", label: "Context / Notes", type: "textarea", placeholder: "Any context about meeting them...", colSpan: 2 },
    
    { 
      name: "privacy_status", 
      label: "Privacy Status", 
      type: "select", 
      colSpan: 2,
      options: [
        { label: "Private", value: "Private" },
        { label: "Public (Pending)", value: "Public_Pending" },
        { label: "Public", value: "Public" },
      ]
    },
  ];

  return (
    <FormBuilder
      schema={contactSchema}
      defaultValues={defaultValues || defaultContactValues}
      onSubmit={onSubmit}
      fields={fields}
      isSubmitting={isSubmitting}
      submitLabel={defaultValues?.id ? "Update Contact" : "Create Contact"}
    />
  );
}
