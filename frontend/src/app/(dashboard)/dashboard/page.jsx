'use client'
import React from 'react'
import { useState } from 'react'
import DashboardKPI from '@/components/dashboardKpi'
import { DataTableServerPagination } from '@/components/shared/data-table-server-pagination'
import { columns } from './applications/columns'

const Dashboard = () => {
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

  return (
    <div className='space-y-6'>
      <DashboardKPI />
      {/* <DataTableServerPagination
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
        
      /> */}
    </div>
  )
}

export default Dashboard