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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  IconBell,
  IconCalendarEvent,
  IconChecks,
  IconArrowRight,
  IconCircleFilled,
  IconLoader2,
  IconStar,
  IconInfoCircle,
} from "@tabler/icons-react";
import { getNotifications } from "@/api/notifications";

const getNotificationIcon = (type) => {
  switch (type) {
    case "Job_Reminder":
      return { icon: IconCalendarEvent, color: "text-violet-500", bg: "bg-violet-500/10" };
    case "System":
      return { icon: IconInfoCircle, color: "text-blue-500", bg: "bg-blue-500/10" };
    case "Milestone":
      return { icon: IconStar, color: "text-amber-500", bg: "bg-amber-500/10" };
    case "Admin_Broadcast":
      return { icon: IconChecks, color: "text-emerald-500", bg: "bg-emerald-500/10" };
    default:
      return { icon: IconBell, color: "text-slate-500", bg: "bg-slate-500/10" };
  }
};

const formatRelativeTime = (dateStr) => {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  return `${days} day${days === 1 ? "" : "s"} ago`;
};

export default function LatestNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await getNotifications();
        const data = response?.data ?? response;
        const all = Array.isArray(data) ? data : (data?.results ?? []);
        setNotifications(all.slice(0, 10));
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <Card className="border border-border/50 bg-card/80 backdrop-blur-sm shadow-sm py-0 h-full min-h-[120px]">
      <CardHeader className="py-4 px-5">
        <div className="flex items-center gap-2">
          <CardTitle className="text-sm font-semibold">
            Latest Notifications
          </CardTitle>
          {unreadCount > 0 && (
            <Badge className="text-[10px] px-1.5 py-0 h-4 bg-violet-500 hover:bg-violet-600">
              {unreadCount}
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
        {loading ? (
          <div className="flex items-center justify-center h-[340px]">
            <IconLoader2 size={20} className="animate-spin text-muted-foreground" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex items-center justify-center min-h-[50px] text-xs text-muted-foreground">
            No notifications yet.
          </div>
        ) : (
          <ScrollArea className="h-[340px]">
            <div className="divide-y divide-border/50">
              {notifications.map((notif) => {
                const { icon: NotifIcon, color, bg } = getNotificationIcon(notif.notification_type);
                return (
                  <div
                    key={notif.id}
                    className={`flex items-start gap-3 px-5 py-3.5 hover:bg-muted/30 transition-colors duration-200 ${!notif.is_read ? "bg-muted/10" : ""}`}
                  >
                    {/* Icon */}
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${bg} ${color} mt-0.5`}
                    >
                      <NotifIcon size={16} stroke={1.5} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p
                          className={`text-xs font-semibold ${!notif.is_read ? "text-foreground" : "text-muted-foreground"}`}
                        >
                          {notif.title}
                        </p>
                        {!notif.is_read && (
                          <IconCircleFilled
                            size={6}
                            className="text-violet-500 shrink-0"
                          />
                        )}
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed line-clamp-2">
                        {notif.description}
                      </p>
                      <p className="text-[10px] text-muted-foreground/60 mt-1">
                        {formatRelativeTime(notif.created)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
