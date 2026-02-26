"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Pen, Trash } from "lucide-react";

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

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

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
    accessorKey: "first_name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
        const firstName = row.getValue("first_name");
        const lastName = row.original.last_name;
        const profileImage = row.original.profile_image_url;
        
        return (
            <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                    <AvatarImage src={profileImage} alt={`${firstName} ${lastName}`} />
                    <AvatarFallback>{firstName?.charAt(0)}{lastName?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="font-medium">{firstName} {lastName}</div>
            </div>
        )
    }
  },
  {
    accessorKey: "company",
    header: "Company",
    cell: ({ row }) => {
        const company = row.getValue("company");
        const designation = row.original.designation;
        return (
            <div className="flex flex-col">
                <span className="font-medium">{company}</span>
                <span className="text-xs text-muted-foreground">{designation}</span>
            </div>
        )
    }
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => <div className="text-sm">{row.getValue("phone") || "—"}</div>,
  },
  {
    accessorKey: "created",
    header: "Added",
    cell: ({ row }) => {
        const val = row.getValue("created");
        if (!val) return null;
        const date = new Date(val);
        return <div className="text-xs text-muted-foreground">{date.toLocaleDateString()}</div>
    }
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const contact = row.original;
      // Access the meta functions passed to the table
      const meta = table.options.meta;
      
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
              onClick={() => navigator.clipboard.writeText(contact.email)}
            >
              Copy Email
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => meta?.editContact(contact)}>
                <Pen className="mr-2 h-4 w-4" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem 
                onClick={() => meta?.deleteContact(contact.id)}
                className="text-destructive focus:text-destructive"
            >
                <Trash className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
