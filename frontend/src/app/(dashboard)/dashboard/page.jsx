import React from 'react'
import DataTable from '@/components/data-table'
import DashboardKPI from '@/components/dashboardKpi'

const Dashboard = () => {
  return (
    <div>
      <DashboardKPI />
      <DataTable />
    </div>
  )
}

export default Dashboard