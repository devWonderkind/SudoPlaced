import React from 'react'
import DataTable from '@/components/data-table'
import DashboardKPI from '@/components/dashboardKpi'

const Dashboard = () => {
  return (
    <div className='space-y-6'>
      <DashboardKPI />
      <DataTable />
    </div>
  )
}

export default Dashboard