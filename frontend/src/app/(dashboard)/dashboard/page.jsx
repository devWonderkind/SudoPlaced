"use client";

import React from "react";
import StatCards from "@/components/dashboard/stat-cards";
import DashboardCalendar from "@/components/dashboard/dashboard-calendar";
import RecentApplications from "@/components/dashboard/recent-applications";
import LatestNotifications from "@/components/dashboard/latest-notifications";
import UpcomingInterviews from "@/components/dashboard/upcoming-interviews";

const Dashboard = () => {
  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_300px] lg:grid-rows-[auto_1fr] auto-rows-auto">
      {/* Row 1, Left: KPI Cards */}
      <div className="min-w-0">
        <StatCards />
      </div>

      {/* Right column: Calendar + Notifications spanning both rows */}
      <div className="lg:row-span-2 flex flex-col gap-5">
        <DashboardCalendar />
        <LatestNotifications />
      </div>

      {/* Row 2, Left: Recent Apps + Upcoming Interviews */}
      <div className="space-y-5 min-w-0">
        <RecentApplications />
        <UpcomingInterviews />
      </div>
    </div>
  );
};

export default Dashboard;