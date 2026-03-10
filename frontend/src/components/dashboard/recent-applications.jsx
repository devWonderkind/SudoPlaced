"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardAction,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  IconArrowRight,
  IconBuildingCommunity,
  IconBriefcase,
  IconMapPin,
} from "@tabler/icons-react";

const recentApplications = [
  {
    id: 1,
    company: "Google",
    role: "Software Engineer",
    location: "Bangalore",
    status: "Applied",
    date: "Mar 8, 2026",
    statusColor: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  },
  {
    id: 2,
    company: "Microsoft",
    role: "Frontend Developer",
    location: "Hyderabad",
    status: "Interview",
    date: "Mar 6, 2026",
    statusColor: "bg-violet-500/10 text-violet-700 dark:text-violet-400",
  },
  {
    id: 3,
    company: "Amazon",
    role: "SDE-1",
    location: "Remote",
    status: "In Review",
    date: "Mar 4, 2026",
    statusColor: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  },
  {
    id: 4,
    company: "Meta",
    role: "Product Engineer",
    location: "Gurgaon",
    status: "Applied",
    date: "Mar 2, 2026",
    statusColor: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  },
];

export default function RecentApplications() {
  return (
    <Card className="border border-border/50 bg-card/80 backdrop-blur-sm shadow-sm py-0">
      <CardHeader className="py-4 px-5">
        <CardTitle className="text-sm font-semibold">
          Recent Applications
        </CardTitle>
        <CardAction>
          <Button variant="ghost" size="sm" asChild className="text-xs gap-1">
            <Link href="/dashboard/applications">
              View all
              <IconArrowRight size={14} />
            </Link>
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="px-0 pb-0">
        <div className="divide-y divide-border/50">
          {recentApplications.map((app) => (
            <div
              key={app.id}
              className="flex items-center gap-4 px-5 py-3.5 hover:bg-muted/30 transition-colors duration-200"
            >
              {/* Company avatar */}
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted/60 text-muted-foreground">
                <IconBuildingCommunity size={18} stroke={1.5} />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{app.company}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <IconBriefcase size={12} />
                    {app.role}
                  </span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <IconMapPin size={12} />
                    {app.location}
                  </span>
                </div>
              </div>

              {/* Status & Date */}
              <div className="flex flex-col items-end gap-1 shrink-0">
                <Badge
                  variant="secondary"
                  className={`text-[10px] font-medium px-2 py-0 border-0 ${app.statusColor}`}
                >
                  {app.status}
                </Badge>
                <span className="text-[10px] text-muted-foreground">
                  {app.date}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
