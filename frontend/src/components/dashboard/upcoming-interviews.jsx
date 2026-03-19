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
  IconCalendarEvent,
  IconClock,
  IconBuildingCommunity,
  IconBriefcase,
  IconLoader2,
} from "@tabler/icons-react";
import { getApplications } from "@/api/applications";

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

const formatTime = (dateStr) => {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
};

const getInterviewTypeColor = (statusLabel) => {
  const label = (statusLabel || "").toLowerCase();
  if (label === "interviewing") return "bg-blue-500/10 text-blue-700 dark:text-blue-400";
  if (label === "assessment") return "bg-amber-500/10 text-amber-700 dark:text-amber-400";
  if (label === "offered") return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400";
  return "bg-violet-500/10 text-violet-700 dark:text-violet-400";
};

export default function UpcomingInterviews() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const data = await getApplications();
        const all = Array.isArray(data) ? data : (data?.results ?? []);

        const now = new Date();
        // Filter apps that have an upcoming interview_date
        const upcoming = all
          .filter((app) => app.interview_date && new Date(app.interview_date) >= now)
          .sort((a, b) => new Date(a.interview_date) - new Date(b.interview_date))
          .slice(0, 4);

        setInterviews(upcoming);
      } catch (err) {
        console.error("Failed to fetch upcoming interviews:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInterviews();
  }, []);

  return (
    <Card className="border border-border/50 bg-card/80 backdrop-blur-sm shadow-sm py-0">
      <CardHeader className="py-4 px-5">
        <CardTitle className="text-sm font-semibold">
          Upcoming Interviews
        </CardTitle>
        <CardAction>
          <Button variant="ghost" size="sm" asChild className="text-xs gap-1">
            <Link href="/dashboard/interview-schedule">
              View all
              <IconArrowRight size={14} />
            </Link>
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="px-5 pb-5">
        {loading ? (
          <div className="flex items-center justify-center h-24">
            <IconLoader2 size={20} className="animate-spin text-muted-foreground" />
          </div>
        ) : interviews.length === 0 ? (
          <div className="flex items-center justify-center h-24 text-xs text-muted-foreground">
            No upcoming interviews scheduled.
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {interviews.map((interview) => (
              <div
                key={interview.id}
                className="group relative rounded-xl border border-border/50 bg-background/50 p-4 hover:border-border hover:bg-muted/20 transition-all duration-300"
              >
                {/* Header row */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted/60 text-muted-foreground">
                      <IconBuildingCommunity size={16} stroke={1.5} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{interview.company_name}</p>
                      <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                        <IconBriefcase size={10} />
                        {interview.role_title}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant="secondary"
                    className={`text-[10px] font-medium px-2 py-0 border-0 ${getInterviewTypeColor(interview.status_label)}`}
                  >
                    {interview.status_label || "Interview"}
                  </Badge>
                </div>

                {/* Details */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <IconCalendarEvent size={13} className="shrink-0" />
                    <span>{formatDate(interview.interview_date)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <IconClock size={13} className="shrink-0" />
                    <span>{formatTime(interview.interview_date)}</span>
                  </div>
                </div>

                {/* Subtle hover glow */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-violet-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
