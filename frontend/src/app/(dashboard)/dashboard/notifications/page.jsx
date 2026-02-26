"use client";

import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { Bell, Check, Trash2, CheckCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
} from "@/api/notifications";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const { data } = await getNotifications();
      const results = Array.isArray(data) ? data : data.results || [];
      setNotifications(results);
      setUnreadCount(results.filter((n) => !n.is_read).length);
    } catch (error) {
      console.error("Failed to load notifications:", error);
      toast.error("Failed to load notifications.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
      toast.success("Marked as read");
    } catch (error) {
      toast.error("Action failed");
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
      toast.success("All marked as read");
    } catch (error) {
      toast.error("Action failed");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      // Adjust unread count if we deleted an unread one
      const wasUnread = notifications.find(n => n.id === id)?.is_read === false;
        if(wasUnread) setUnreadCount((prev) => Math.max(0, prev - 1));
      toast.success("Notification deleted");
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="flex flex-col h-full space-y-6 p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Notifications</h2>
          <p className="text-muted-foreground">
            Stay updated with your latest alerts and reminders.
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" onClick={handleMarkAllRead}>
            <CheckCheck className="mr-2 h-4 w-4" />
            Mark all as read
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Alerts {unreadCount > 0 && <Badge variant="destructive" className="ml-2">{unreadCount} New</Badge>}</CardTitle>
          <CardDescription>You have {notifications.length} total notifications.</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px] w-full rounded-md border p-4">
            {isLoading ? (
               <div className="flex justify-center items-center h-20">
                   <Loader2 className="h-6 w-6 animate-spin text-muted-foreground"/>
               </div>
            ) : notifications.length === 0 ? (
                <div className="text-center text-muted-foreground py-12">
                    No notifications to show.
                </div>
            ) : (
                <div className="space-y-4">
                    {notifications.map((notification) => (
                        <div key={notification.id} className={`flex items-start justify-between p-4 rounded-lg border ${!notification.is_read ? 'bg-muted/50 border-l-4 border-l-primary' : 'bg-background'}`}>
                            <div className="space-y-1">
                                <h4 className="text-sm font-semibold flex items-center gap-2">
                                    {notification.title}
                                    {!notification.is_read && <Badge variant="secondary" className="text-[10px] h-5">New</Badge>}
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                    {notification.description}
                                </p>
                                <div className="text-xs text-muted-foreground pt-2 flex gap-4">
                                    <span>{format(new Date(notification.created), "PPp")}</span>
                                    <Badge variant="outline" className="text-[10px] h-5">{notification.notification_type || 'General'}</Badge>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 ml-4">
                                {!notification.is_read && (
                                    <Button size="icon" variant="ghost" title="Mark as Read" onClick={() => handleMarkRead(notification.id)}>
                                        <Check className="h-4 w-4" />
                                    </Button>
                                )}
                                <Button size="icon" variant="ghost" className="text-destructive hover:text-destructive" title="Delete" onClick={() => handleDelete(notification.id)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
