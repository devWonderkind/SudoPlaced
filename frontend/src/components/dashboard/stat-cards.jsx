"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  IconFileAnalytics,
  IconCalendarEvent,
  IconLoader2,
} from "@tabler/icons-react";

const stats = [
  {
    title: "Total Applications",
    value: 128,
    change: "+12%",
    changeType: "positive",
    icon: IconFileAnalytics,
    gradient: "from-blue-500/10 to-indigo-500/10",
    iconBg: "bg-blue-500/10 dark:bg-blue-500/20",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  {
    title: "Interview Scheduled",
    value: 24,
    change: "+3",
    changeType: "positive",
    icon: IconCalendarEvent,
    gradient: "from-violet-500/10 to-purple-500/10",
    iconBg: "bg-violet-500/10 dark:bg-violet-500/20",
    iconColor: "text-violet-600 dark:text-violet-400",
  },
  {
    title: "In Progress",
    value: 42,
    change: "Active",
    changeType: "neutral",
    icon: IconLoader2,
    gradient: "from-amber-500/10 to-orange-500/10",
    iconBg: "bg-amber-500/10 dark:bg-amber-500/20",
    iconColor: "text-amber-600 dark:text-amber-400",
  },
];

export default function StatCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {stats.map((item, index) => (
        <Card
          key={index}
          className="group relative overflow-hidden border border-border/50 bg-card/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300 hover:border-border py-0"
        >
          {/* Subtle gradient background */}
          <div
            className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
          />

          <CardContent className="relative flex items-center gap-4 p-5">
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${item.iconBg} ${item.iconColor} transition-transform duration-300 group-hover:scale-105`}
            >
              <item.icon size={24} stroke={1.5} />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-muted-foreground tracking-wider">
                {item.title}
              </p>
              <div className="flex items-baseline gap-2 mt-0.5">
                <h2 className="text-2xl font-bold tracking-tight">
                  {item.value}
                </h2>
                {/* <span
                  className={`text-xs font-medium ${item.changeType === "positive"
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-muted-foreground"
                    }`}
                >
                  {item.change}
                </span> */}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
