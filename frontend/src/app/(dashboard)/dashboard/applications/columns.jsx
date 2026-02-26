"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Pen, Trash, Eye } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

export const columns = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "role_title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Role & Company
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
        const role = row.getValue("role_title");
        const company = row.original.company_name;
        const logo = row.original.company_logo;
        
        return (
            <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9 bg-white border">
                    <AvatarImage src={logo} alt={company} className="object-contain p-1" />
                    <AvatarFallback className="bg-primary/10 text-primary">{company?.substring(0,2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <span className="font-medium truncate max-w-[200px]" title={role}>{role}</span>
                    <span className="text-xs text-muted-foreground truncate max-w-[200px]">{company}</span>
                </div>
            </div>
        )
    }
  },
  {
    accessorKey: "status", 
    header: "Status",
    cell: ({ row }) => {
        const statusLabel = row.original.status_label || "Unknown";
        // Simple color mapping logic (can be expanded)
        let variant = "secondary";
        if (["Applied", "Assessment"].includes(statusLabel)) variant = "outline";
        if (["Interviewing", "Offered"].includes(statusLabel)) variant = "default";
        if (["Rejected", "Ghosted"].includes(statusLabel)) variant = "destructive";

        return <Badge variant={variant}>{statusLabel}</Badge>
    }
  },
  {
    accessorKey: "work_mode",
    header: "Work Mode",
    cell: ({ row }) => {
        const mode = row.getValue("work_mode");
        if (!mode) return <span className="text-muted-foreground">-</span>;
        return <span className="text-sm">{mode}</span>;
    }
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => {
        const loc = row.getValue("location");
         if (!loc) return <span className="text-muted-foreground">-</span>;
        return <div className="text-sm truncate max-w-[150px]" title={loc}>{loc}</div>;
    },
  },
  {
    accessorKey: "applied_on",
    header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Applied
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
    ),
    cell: ({ row }) => {
        const dateStr = row.getValue("applied_on");
        if (!dateStr) return <span className="text-muted-foreground text-xs">Not set</span>;
        return <div className="text-sm font-medium">{format(new Date(dateStr), "MMM dd, yyyy")}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const application = row.original;
      const meta = table.options.meta; // Access custom handlers passed to generic table

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(application.id?.toString())}
            >
              Copy Application ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => meta?.onEdit(application)}>
                <Pen className="mr-2 h-4 w-4 text-muted-foreground" />
                Edit
            </DropdownMenuItem>
             <DropdownMenuItem onClick={() => meta?.onView(application)}>
                <Eye className="mr-2 h-4 w-4 text-muted-foreground" />
                View Details
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
                className="text-destructive focus:text-destructive"
                onClick={() => meta?.onDelete(application)}
            >
                <Trash className="mr-2 h-4 w-4" />
                Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
