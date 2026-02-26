"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

/**
 * Reusable Form Builder Component
 *
 * @param {Object} props
 * @param {Object} props.schema - Zod schema for validation
 * @param {Object} props.defaultValues - Default values for the form
 * @param {Function} props.onSubmit - Submit handler
 * @param {Array} props.fields - Array of field configurations
 * @param {boolean} props.isSubmitting - Loading state
 * @param {string} props.submitLabel - Label for the submit button
 * @param {string} props.className - Optional class name
 */
export function FormBuilder({
  schema,
  defaultValues = {},
  onSubmit,
  fields = [],
  isSubmitting = false,
  submitLabel = "Submit",
  className,
}) {
  const form = useForm({
    resolver: schema ? zodResolver(schema) : undefined,
    defaultValues,
  });

  const handleSubmit = async (data) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className={cn("space-y-6", className)}
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {fields.map((field) => {
            const {
              name,
              label,
              type = "text",
              placeholder = "",
              description = "",
              options = [],
              className: fieldClassName = "",
              colSpan = 1, // 1 or 2 (full width)
              disabled = false,
            } = field;

            return (
              <FormField
                key={name}
                control={form.control}
                name={name}
                render={({ field: formField }) => (
                  <FormItem
                    className={cn(
                      colSpan === 2 ? "col-span-1 md:col-span-2" : "col-span-1",
                      fieldClassName
                    )}
                  >
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                      {/* Render Input based on type */}
                      {(() => {
                        if (type === "textarea") {
                          return (
                            <Textarea
                              placeholder={placeholder}
                              disabled={disabled || isSubmitting}
                              {...formField}
                            />
                          );
                        }

                        if (type === "select") {
                          return (
                            <Select
                              onValueChange={formField.onChange}
                              defaultValue={formField.value}
                              disabled={disabled || isSubmitting}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder={placeholder} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {options.map((option) => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          );
                        }

                        // Default: Text, Email, Number, Url, etc.
                        return (
                          <Input
                            type={type}
                            placeholder={placeholder}
                            disabled={disabled || isSubmitting}
                            {...formField}
                          />
                        );
                      })()}
                    </FormControl>
                    {description && (
                      <FormDescription>{description}</FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            );
          })}
        </div>

        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
}
