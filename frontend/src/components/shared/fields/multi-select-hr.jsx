"use client";

import React, { useState } from "react";
import { Check, ChevronsUpDown, Plus, X } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getContacts, createContact } from "@/api/hr-directory";
import api from "@/api";

export function MultiSelectHR({ value = [], onChange, placeholder = "Select HR Contacts..." }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newContact, setNewContact] = useState({ first_name: "", company: "", designation: "" });

  const queryClient = useQueryClient();

  // Fetch contacts
  const { data: contactsData, isLoading } = useQuery({
    queryKey: ["contacts", "simple"],
    queryFn: () => getContacts({ page_size: 100 }), // Fetch a reasonable amount for the dropdown
  });

  const contacts = contactsData?.results || [];

  const handleCreateNew = async () => {
    if (!newContact.first_name || !newContact.company) return;
    
    // Optimistic or real create
    try {
        const created = await api.post("directory/contacts/", {
            first_name: newContact.first_name,
            last_name: "", // optional
            company: newContact.company,
            designation: newContact.designation,
            privacy_status: "Private"
        }).then(res => res.data);
        
        // Add to selection
        onChange([...value, created.id]);
        
        // Close modal
        setIsCreateOpen(false);
        setNewContact({ first_name: "", company: "", designation: "" });
        setOpen(false);
        
        // Refresh local cache
        queryClient.invalidateQueries(["contacts"]);
    } catch(err) {
        console.error("Failed to create contact", err);
    }
  };

  const selectedContacts = contacts.filter((c) => value.includes(c.id));

  return (
    <div className="flex flex-col gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between h-auto min-h-[40px] px-3 py-2"
          >
           <div className="flex flex-wrap gap-1">
            {selectedContacts.length > 0 ? (
                selectedContacts.map((contact) => (
                    <Badge key={contact.id} variant="secondary" className="mr-1 mb-1">
                    {contact.first_name} ({contact.company})
                    <X
                        className="ml-1 h-3 w-3 text-muted-foreground hover:text-foreground cursor-pointer"
                        onClick={(e) => {
                            e.stopPropagation();
                            onChange(value.filter((id) => id !== contact.id));
                        }}
                    />
                    </Badge>
                ))
            ) : (
             <span className="text-muted-foreground">{placeholder}</span>
            )}
           </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search contacts..." value={search} onValueChange={setSearch} />
            <CommandList>
              <CommandEmpty>No contact found.</CommandEmpty>
              <CommandGroup heading="Suggestions">
                {contacts.map((contact) => (
                  <CommandItem
                    key={contact.id}
                    value={contact.id?.toString() + " " + contact.first_name + " " + contact.company} 
                    // Search hack: value includes extra fields for filtering but item is selected by ID
                    onSelect={() => {
                        const isSelected = value.includes(contact.id);
                        if (isSelected) {
                            onChange(value.filter((id) => id !== contact.id));
                        } else {
                            onChange([...value, contact.id]);
                        }
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value.includes(contact.id) ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex flex-col">
                        <span>{contact.first_name} {contact.last_name}</span>
                        <span className="text-xs text-muted-foreground">{contact.designation} at {contact.company}</span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandSeparator />
               <CommandGroup>
                <CommandItem onSelect={() => setIsCreateOpen(true)} className="cursor-pointer font-medium text-primary">
                  <Plus className="mr-2 h-4 w-4" />
                  Create New &quot;{search}&quot;
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Quick Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Contact</DialogTitle>
            <DialogDescription>
              Quickly add a new HR contact. You can edit full details later in the Directory.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={newContact.first_name}
                onChange={(e) => setNewContact({...newContact, first_name: e.target.value})}
                className="col-span-3"
                placeholder="Jane Doe"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="company" className="text-right">
                Company
              </Label>
              <Input
                id="company"
                value={newContact.company}
                onChange={(e) => setNewContact({...newContact, company: e.target.value})}
                className="col-span-3"
                placeholder="Acme Inc."
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Role
              </Label>
              <Input
                id="role"
                value={newContact.designation}
                onChange={(e) => setNewContact({...newContact, designation: e.target.value})}
                className="col-span-3"
                placeholder="Recruiter"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleCreateNew}>
                Save Contact
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
