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
  IconCalendarEvent,
  IconClock,
  IconBuildingCommunity,
  IconBriefcase,
  IconUser,
} from "@tabler/icons-react";

const upcomingInterviews = [
  {
    id: 1,
    company: "Google",
    role: "SDE — Round 2",
    interviewer: "Aakanksha",
    date: "Mar 12, 2026",
    time: "2:00 PM – 3:00 PM",
    type: "Technical",
    typeColor: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  },
  {
    id: 2,
    company: "Microsoft",
    role: "Frontend Developer",
    interviewer: "Devang Shaurya",
    date: "Mar 15, 2026",
    time: "10:00 AM – 11:00 AM",
    type: "HR Round",
    typeColor:
      "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  },
];

export default function UpcomingInterviews() {
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
        <div className="grid gap-3 sm:grid-cols-2">
          {upcomingInterviews.map((interview) => (
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
                    <p className="text-sm font-semibold">{interview.company}</p>
                    <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                      <IconBriefcase size={10} />
                      {interview.role}
                    </p>
                  </div>
                </div>
                <Badge
                  variant="secondary"
                  className={`text-[10px] font-medium px-2 py-0 border-0 ${interview.typeColor}`}
                >
                  {interview.type}
                </Badge>
              </div>

              {/* Details */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <IconCalendarEvent size={13} className="shrink-0" />
                  <span>{interview.date}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <IconClock size={13} className="shrink-0" />
                  <span>{interview.time}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <IconUser size={13} className="shrink-0" />
                  <span>{interview.interviewer}</span>
                </div>
              </div>

              {/* Subtle hover glow */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-violet-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
