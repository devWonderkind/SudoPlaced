// src/components/shared/form-dialog.jsx
"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

/**
 * A reusable dialog component for forms.
 * 
 * @param {boolean} open - Whether the dialog is open
 * @param {function} onOpenChange - Handler for open state change
 * @param {string} title - The title of the dialog
 * @param {string} description - The description of the dialog
 * @param {React.ReactNode} children - The form or content to render inside
 * @param {string} className - Optional className for the DialogContent (e.g. max-w-lg)
 */
export function FormDialog({ 
  open, 
  onOpenChange, 
  title, 
  description, 
  children, 
  className = "sm:max-w-[600px]" 
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`${className} flex flex-col max-h-[85vh]`}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <ScrollArea className="flex-1 w-full pr-4 -mr-4 overflow-y-auto h-full">
            <div className="p-1">
                {children}
            </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
