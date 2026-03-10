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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  IconBell,
  IconCalendarEvent,
  IconChecks,
  IconArrowRight,
  IconCircleFilled,
} from "@tabler/icons-react";

const notifications = [
  {
    id: 1,
    title: "Interview Scheduled",
    message: "Google — SDE Round 2 on Mar 12",
    time: "2 hours ago",
    icon: IconCalendarEvent,
    iconColor: "text-violet-500",
    iconBg: "bg-violet-500/10",
    unread: true,
  },
  {
    id: 2,
    title: "Application Viewed",
    message: "Microsoft reviewed your profile",
    time: "5 hours ago",
    icon: IconChecks,
    iconColor: "text-emerald-500",
    iconBg: "bg-emerald-500/10",
    unread: true,
  },
  {
    id: 3,
    title: "Reminder",
    message: "Amazon interview prep due tomorrow",
    time: "1 day ago",
    icon: IconBell,
    iconColor: "text-amber-500",
    iconBg: "bg-amber-500/10",
    unread: false,
  }
];

export default function LatestNotifications() {
  return (
    <Card className="border border-border/50 bg-card/80 backdrop-blur-sm shadow-sm py-0 h-full">
      <CardHeader className="py-4 px-5">
        <div className="flex items-center gap-2">
          <CardTitle className="text-sm font-semibold">
            Latest Notifications
          </CardTitle>
          {notifications.filter((n) => n.unread).length > 0 && (
            <Badge className="text-[10px] px-1.5 py-0 h-4 bg-violet-500 hover:bg-violet-600">
              {notifications.filter((n) => n.unread).length}
            </Badge>
          )}
        </div>
        <CardAction>
          <Button variant="ghost" size="sm" asChild className="text-xs gap-1">
            <Link href="/dashboard/notifications">
              View all
              <IconArrowRight size={14} />
            </Link>
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="px-0 pb-0">
        <ScrollArea className="h-[340px]">
          <div className="divide-y divide-border/50">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className={`flex items-start gap-3 px-5 py-3.5 hover:bg-muted/30 transition-colors duration-200 ${notif.unread ? "bg-muted/10" : ""
                  }`}
              >
                {/* Icon */}
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${notif.iconBg} ${notif.iconColor} mt-0.5`}
                >
                  <notif.icon size={16} stroke={1.5} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p
                      className={`text-xs font-semibold ${notif.unread ? "text-foreground" : "text-muted-foreground"}`}
                    >
                      {notif.title}
                    </p>
                    {notif.unread && (
                      <IconCircleFilled
                        size={6}
                        className="text-violet-500 shrink-0"
                      />
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                    {notif.message}
                  </p>
                  <p className="text-[10px] text-muted-foreground/60 mt-1">
                    {notif.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
