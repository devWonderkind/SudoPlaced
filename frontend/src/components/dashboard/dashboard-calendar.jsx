"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";

// Sample dates with events (interviews scheduled)
const eventDates = [
  new Date(2026, 2, 12),
  new Date(2026, 2, 15),
  new Date(2026, 2, 18),
  new Date(2026, 2, 22),
];

export default function DashboardCalendar() {
  const [date, setDate] = useState(new Date());

  return (
    <Card className="border border-border/50 bg-card/80 backdrop-blur-sm shadow-sm py-0 h-full">
      <CardHeader className="pb-2 pt-2 px-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold">Calendar</CardTitle>
          <Badge
            variant="secondary"
            className="text-[10px] font-medium px-2 py-0.5"
          >
            {eventDates.length} events
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-2 pt-0 flex items-center justify-center">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          modifiers={{ event: eventDates }}
          modifiersClassNames={{
            event:
              "relative after:absolute after:bottom-0.5 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:rounded-full after:bg-violet-500",
          }}
          className="rounded-md w-full"
        />
      </CardContent>
    </Card>
  );
}
