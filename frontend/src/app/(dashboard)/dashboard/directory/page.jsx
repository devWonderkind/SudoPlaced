"use client";

import React, { useState, useEffect, useCallback } from "react";
import { 
  Plus, 
  LayoutGrid, 
  List, 
  Search, 
  Loader2 
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  getContacts,
  createContact,
  updateContact,
  deleteContact
} from "@/api/hr-directory";

import { ContactFormBuilder } from "./contact-form";
import { ContactCard } from "./contact-card";
import { columns } from "./columns";
import { DataTableServerPagination } from "@/components/shared/data-table-server-pagination";
import { FormDialog } from "@/components/shared/form-dialog";

export default function DirectoryPage() {
  // View specific state
  const [viewMode, setViewMode] = useState("table"); // 'table' | 'grid'

  // Data state
  const [contacts, setContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [rowCount, setRowCount] = useState(0);
  const [pageCount, setPageCount] = useState(0);

  // Table state (Server-side)
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");

  // Modal state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null); // For Edit
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete Dialog State
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState(null);

  // Fetch Data Function
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Prepare query params
      const params = {
        page: pagination.pageIndex + 1,
        page_size: pagination.pageSize,
        search: globalFilter,
      };

      if (sorting.length > 0) {
        const sortField = sorting[0].id;
        const sortOrder = sorting[0].desc ? "-" : "";
        params.ordering = `${sortOrder}${sortField}`;
      }

      const response = await getContacts(params);
      
      setContacts(response.results);
      setRowCount(response.count);
      setPageCount(Math.ceil(response.count / pagination.pageSize));
    } catch (error) {
      console.error("Failed to fetch contacts:", error);
      toast.error("Failed to load contacts. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [pagination, sorting, globalFilter]);

  // Effect to fetch data when dependencies change
  useEffect(() => {
    // simple debounce for search
    const timer = setTimeout(() => {
        fetchData();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchData]);

  // Handlers
  const handleCreateOpen = () => {
    setSelectedContact(null);
    setIsDialogOpen(true);
  };

  const handleEditOpen = (contact) => {
    setSelectedContact(contact);
    setIsDialogOpen(true);
  };

  const handleDeleteOpen = (id) => {
      setContactToDelete(id);
      setDeleteDialogOpen(true);
  };

  const handleFormSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      if (selectedContact) {
        await updateContact(selectedContact.id, values);
        toast.success("Contact updated successfully");
      } else {
        await createContact(values);
        toast.success("Contact created successfully");
      }
      setIsDialogOpen(false);
      fetchData(); // Refresh list
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error(error.response?.data?.detail || "An error occurred. Please try again.");
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
      if (!contactToDelete) return;
      try {
          await deleteContact(contactToDelete);
          toast.success("Contact deleted successfully");
          setDeleteDialogOpen(false);
          setContactToDelete(null);
          fetchData();
      } catch (error) {
          console.error("Delete error:", error);
          toast.error("Failed to delete contact.");
      }
  };

  return (
    <div className="flex flex-col h-full space-y-6 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">HR Directory</h2>
          <p className="text-muted-foreground">
            Manage your professional network and contacts.
          </p>
        </div>
        <div className="flex items-center space-x-2">
            
          <Tabs value={viewMode} onValueChange={setViewMode} className="w-[100px]">
             <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="table"><List className="h-4 w-4"/></TabsTrigger>
                <TabsTrigger value="grid"><LayoutGrid className="h-4 w-4"/></TabsTrigger>
             </TabsList>
          </Tabs>

          <Button onClick={handleCreateOpen}>
            <Plus className="mr-2 h-4 w-4" /> Add Contact
          </Button>
        </div>
      </div>

      {/* Grid View Specific Controls (Search) - Only show if in Grid Mode as Table has its own */}
      {viewMode === 'grid' && (
          <div className="flex items-center space-x-2">
              <div className="relative w-full max-w-sm">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search contacts..." 
                    value={globalFilter}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    className="pl-8"
                  />
              </div>
          </div>
      )}

      {/* Content */}
      <div className="flex-1">
        {viewMode === "table" ? (
          <DataTableServerPagination
            columns={columns}
            data={contacts}
            pageCount={pageCount}
            rowCount={rowCount}
            state={{
              pagination,
              sorting,
              globalFilter,
            }}
            onPaginationChange={setPagination}
            onSortingChange={setSorting}
            onGlobalFilterChange={setGlobalFilter}
            isLoading={isLoading}
            meta={{
                editContact: handleEditOpen,
                deleteContact: handleDeleteOpen
            }}
          />
        ) : (
          /* Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
             {isLoading ? (
                 <div className="col-span-full h-24 flex items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground"/>
                 </div>
             ) : contacts.length > 0 ? (
                 contacts.map((contact) => (
                    <ContactCard 
                        key={contact.id} 
                        contact={contact} 
                        onEdit={handleEditOpen}
                        onDelete={handleDeleteOpen}
                    />
                 ))
             ) : (
                 <div className="col-span-full text-center text-muted-foreground py-12">
                     No contacts found.
                 </div>
             )}
             
             {/* Simple Pagination for Grid View */}
             {!isLoading && rowCount > 0 && (
                 <div className="col-span-full flex items-center justify-center space-x-2 py-4">
                     <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setPagination(p => ({...p, pageIndex: p.pageIndex - 1}))}
                        disabled={pagination.pageIndex === 0}
                     >
                        Previous
                     </Button>
                     <span className="text-sm text-muted-foreground">
                        Page {pagination.pageIndex + 1} of {pageCount}
                     </span>
                     <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setPagination(p => ({...p, pageIndex: p.pageIndex + 1}))}
                        disabled={pagination.pageIndex >= pageCount - 1}
                     >
                        Next
                     </Button>
                 </div>
             )}
          </div>
        )}
      </div>

      {/* Create/Edit Dialog */}
      <FormDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          title={selectedContact ? "Edit Contact" : "Add New Contact"}
          description={selectedContact 
                    ? "Make changes to the contact details here." 
                    : "Add a new person to your professional network."}
      >
          <ContactFormBuilder 
            defaultValues={selectedContact} 
            onSubmit={handleFormSubmit} 
            isSubmitting={isSubmitting}
          />
      </FormDialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the contact from your directory.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Delete
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}
