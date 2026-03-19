"use client";

import React, { useEffect, useState } from "react";
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
  IconLoader2,
} from "@tabler/icons-react";
import { getApplications } from "@/api/applications";

// Map status labels to badge colour classes
const getStatusColor = (statusLabel) => {
  const label = (statusLabel || "").toLowerCase();
  if (label === "applied") return "bg-blue-500/10 text-blue-700 dark:text-blue-400";
  if (label === "interviewing" || label === "interview")
    return "bg-violet-500/10 text-violet-700 dark:text-violet-400";
  if (label === "offered") return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400";
  if (label === "rejected") return "bg-red-500/10 text-red-700 dark:text-red-400";
  if (label === "assessment") return "bg-amber-500/10 text-amber-700 dark:text-amber-400";
  if (label === "ghosted") return "bg-slate-500/10 text-slate-600 dark:text-slate-400";
  if (label === "bookmarked") return "bg-indigo-500/10 text-indigo-700 dark:text-indigo-400";
  return "bg-muted text-muted-foreground";
};

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

export default function RecentApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const data = await getApplications();
        const all = Array.isArray(data) ? data : (data?.results ?? []);
        // Sort by most recently modified and take top 4
        const sorted = [...all].sort(
          (a, b) => new Date(b.modified) - new Date(a.modified)
        );
        setApplications(sorted.slice(0, 4));
      } catch (err) {
        console.error("Failed to fetch recent applications:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchApps();
  }, []);

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
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <IconLoader2 size={20} className="animate-spin text-muted-foreground" />
          </div>
        ) : applications.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-xs text-muted-foreground">
            No applications yet.
          </div>
        ) : (
          <div className="divide-y divide-border/50">
            {applications.map((app) => (
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
                  <p className="text-sm font-medium truncate">{app.company_name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <IconBriefcase size={12} />
                      {app.role_title}
                    </span>
                    {app.location && (
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <IconMapPin size={12} />
                        {app.location}
                      </span>
                    )}
                  </div>
                </div>

                {/* Status & Date */}
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <Badge
                    variant="secondary"
                    className={`text-[10px] font-medium px-2 py-0 border-0 ${getStatusColor(app.status_label)}`}
                  >
                    {app.status_label || "Unknown"}
                  </Badge>
                  <span className="text-[10px] text-muted-foreground">
                    {formatDate(app.applied_on || app.modified)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
