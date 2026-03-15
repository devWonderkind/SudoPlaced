'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Plus, List, Kanban } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

import {
  getApplications,
  createApplication,
  updateApplication,
  deleteApplication,
} from '@/api/applications';

import { ApplicationForm } from './application-form';
import { columns } from './columns';
import { DataTableServerPagination } from '@/components/shared/data-table-server-pagination';
import { FormDialog } from '@/components/shared/form-dialog';
import { StatusManager } from './status-manager';
import { ApplicationDetailDialog } from './application-detail-dialog';
import KanbanBoard from '@/components/kanbanBoard';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function ApplicationsPage() {
  const [viewMode, setViewMode] = useState('table');

  // Data state
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [rowCount, setRowCount] = useState(0);
  const [pageCount, setPageCount] = useState(0);

  // Pagination state
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');

  // Modal state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Detail Dialog State
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedDetailApp, setSelectedDetailApp] = useState(null);

  // Delete Dialog State
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [applicationToDelete, setApplicationToDelete] = useState(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = {
        page: pagination.pageIndex + 1,
        page_size: pagination.pageSize,
        search: globalFilter,
      };

      if (sorting.length > 0) {
        const sortField = sorting[0].id;
        const sortOrder = sorting[0].desc ? '-' : '';
        params.ordering = `${sortOrder}${sortField}`;
      }

      const response = await getApplications(params);

      setApplications(response.results || []);
      setRowCount(response.count || 0);
      setPageCount(Math.ceil((response.count || 0) / pagination.pageSize));
    } catch (error) {
      console.error('Failed to fetch applications:', error);
      toast.error('Failed to load applications.');
    } finally {
      setIsLoading(false);
    }
  }, [pagination, sorting, globalFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreate = async (data) => {
    setIsSubmitting(true);
    try {
      await createApplication(data);
      toast.success('Application created successfully');
      setIsDialogOpen(false);
      fetchData();
    } catch (error) {
      console.error('Create error:', error);
      toast.error('Failed to create application');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (data) => {
    if (!selectedApplication) return;
    setIsSubmitting(true);
    try {
      await updateApplication(selectedApplication.id, data);
      toast.success('Application updated successfully');
      setIsDialogOpen(false);
      fetchData();
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Failed to update application');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!applicationToDelete) return;
    try {
      await deleteApplication(applicationToDelete.id);
      toast.success('Application deleted');
      setDeleteDialogOpen(false);
      fetchData();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete application');
    }
  };

  const openCreateDialog = () => {
    setSelectedApplication(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (app) => {
    setSelectedApplication(app);
    setIsDialogOpen(true);
  };

  const openDeleteDialog = (app) => {
    setApplicationToDelete(app);
    setDeleteDialogOpen(true);
  };

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Applications</h1>
        <p className="text-muted-foreground text-sm">
          Manage your job applications and track progress.
        </p>
      </div>
      <div className="flex flex-col flex-wrap items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
          <Tabs value={viewMode} onValueChange={setViewMode} className="w-[200px]">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="table">
                <List className="h-4" />
                <span className="sr-only">Table</span>
              </TabsTrigger>
              <TabsTrigger value="kanban">
                <Kanban />
                <span className="sr-only">Kanban</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="flex items-center gap-2">
          <StatusManager />
          <Button onClick={openCreateDialog}>
            <Plus className="mr-2 h-4 w-4" /> Add Application
          </Button>
        </div>
      </div>

      {/* Content */}
      {viewMode === 'table' ? (
        <DataTableServerPagination
          columns={columns}
          data={applications}
          pageCount={pageCount}
          rowCount={rowCount}
          isLoading={isLoading}
          state={{ pagination, sorting, globalFilter }}
          onPaginationChange={setPagination}
          onSortingChange={setSorting}
          onGlobalFilterChange={setGlobalFilter}
          placeholder="Search by role or company..."
          meta={{
            onEdit: openEditDialog,
            onDelete: openDeleteDialog,
            onView: (app) => {
              setSelectedDetailApp(app);
              setDetailDialogOpen(true);
            },
          }}
        />
      ) : (
        <div className="overflow-x-auto pb-4">
          <KanbanBoard />
        </div>
      )}

      {/* Form Dialog */}
      <Sheet open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <SheetContent side="right" className="w-full overflow-y-auto p-2 sm:max-w-[540px] sm:p-4">
          <SheetHeader className="">
            <SheetTitle>{selectedApplication ? 'Edit Application' : 'New Application'}</SheetTitle>
            {/* <SheetDescription>
              {selectedApplication ? 'Update application details.' : 'Add a new job application.'}
            </SheetDescription> */}
          </SheetHeader>
          <hr />
          <ScrollArea className="-mr-4 h-full w-full flex-1 overflow-y-auto pr-4">
            <div className="py-2">
              <ApplicationForm
                applicationId={selectedApplication?.id}
                defaultValues={
                  selectedApplication
                    ? {
                        ...selectedApplication,
                        status: selectedApplication.status?.toString() || '',
                      }
                    : {
                        role_title: '',
                        company_name: '',
                        status: '',
                        work_mode: 'Remote',
                        expected_salary: '',
                        job_url: '',
                        company_logo: '',
                        location: '',
                        applied_on: new Date().toISOString().split('T')[0],
                        hr_contact_ids: [],
                      }
                }
                onSubmit={(data) => {
                  const payload = {
                    ...data,
                    status:
                      !data.status || data.status === 'undefined' ? null : parseInt(data.status),
                  };
                  selectedApplication ? handleUpdate(payload) : handleCreate(payload);
                }}
                isSubmitting={isSubmitting}
              />
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* Detail Dialog */}
      <ApplicationDetailDialog
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        applicationId={selectedDetailApp?.id}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the application for
              <span className="text-foreground font-semibold">
                {' '}
                {applicationToDelete?.role_title} at {applicationToDelete?.company_name}
              </span>
              .
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
