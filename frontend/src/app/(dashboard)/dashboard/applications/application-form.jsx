"use client";

import React, { useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { FormBuilder } from "@/components/shared/form-builder";
import { applicationSchema } from "@/schemas/application";
import { getApplicationStatuses, getApplication } from "@/api/applications";
import { Loader2 } from "lucide-react";

import { MultiSelectHR } from "@/components/shared/fields/multi-select-hr";

export function ApplicationForm({ defaultValues, onSubmit, isSubmitting, applicationId }) {
  // 1. Fetch Statuses
  const { data: statusData } = useQuery({
    queryKey: ["statuses"],
    queryFn: getApplicationStatuses,
  });

  // 2. Fetch Application Full Details if ID provided
  const { data: applicationData, isLoading: isLoadingApplication } = useQuery({
    queryKey: ["application", applicationId],
    queryFn: () => getApplication(applicationId),
    enabled: !!applicationId,
  });

  // Combine defaultValues (from list) with applicationData (full details)
  const initialValues = useMemo(() => {
    if (applicationId && applicationData) {
        // Prepare data for form
        return {
            ...defaultValues,
            ...applicationData,
            status: applicationData.status?.toString() || "", // Convert status ID to string for Select
            hr_contact_ids: applicationData.hr_contacts?.map(c => c.id) || [], // Extract IDs
            applied_on: applicationData.applied_on || "", // Ensure date string
        };
    }
    return defaultValues;
  }, [applicationId, applicationData, defaultValues]);

  const statusOptions =
    statusData?.results?.map((s) => ({
      label: s.name,
      value: s.id.toString(),
    })) || [];

  if (applicationId && isLoadingApplication) {
      return (
          <div className="flex h-40 items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
      )
  }

  const fields = [
    {
      name: "role_title",
      label: "Role Title",
      placeholder: "e.g. Senior Frontend Engineer",
      colSpan: 1,
    },
    {
      name: "company_name",
      label: "Company",
      placeholder: "e.g. Acme Corp",
      colSpan: 1,
    },
    {
      name: "status",
      label: "Status",
      type: "select",
      options: statusOptions,
      placeholder: "Select Status",
      description: "Default statuses will be created automatically.",
      colSpan: 1,
    },
    {
      name: "work_mode",
      label: "Work Mode",
      type: "select",
      options: [
        { label: "Remote", value: "Remote" },
        { label: "Hybrid", value: "Hybrid" },
        { label: "On-site", value: "On-site" },
      ],
      colSpan: 1,
    },
    {
      name: "location",
      label: "Location",
      placeholder: "e.g. San Francisco, CA",
      colSpan: 1,
    },
    {
      name: "expected_salary",
      label: "Expected Salary",
      placeholder: "e.g. $120k - $150k",
      colSpan: 1,
    },
    {
      name: "job_url",
      label: "Job Posting URL",
      placeholder: "https://...",
      colSpan: 2,
    },
    {
      name: "company_logo",
      label: "Company Logo URL",
      placeholder: "https://...",
      colSpan: 2,
    },
     {
      name: "applied_on",
      label: "Applied On",
      type: "date", // Assumes FormBuilder handles generic input types
      placeholder: "YYYY-MM-DD",
      colSpan: 1,
    },
    {
      name: "hr_contact_ids",
      label: "HR Contacts",
      type: "custom",
      component: MultiSelectHR,
      placeholder: "Select or add HR contacts...",
      colSpan: 2,
    },
  ];

  return (
    <FormBuilder
      schema={applicationSchema}
      defaultValues={initialValues} // Pass the fetched values
      onSubmit={onSubmit} 
      fields={fields}
      isSubmitting={isSubmitting}
      submitLabel="Save Application"
    />
  );
}
