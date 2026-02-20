"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
    IconFileAnalytics,
    IconCircleCheck,
    IconClockHour4,
} from "@tabler/icons-react";

export default function DashboardKPI() {
    const kpiData = [
        {
            title: "Total Applications",
            value: 128,
            icon: <IconFileAnalytics size={28} />,
            color: "text-blue-600",
            bg: "bg-blue-100 dark:bg-blue-900/30",
        },
        {
            title: "Active Applications",
            value: 64,
            icon: <IconCircleCheck size={28} />,
            color: "text-green-600",
            bg: "bg-green-100 dark:bg-green-900/30",
        },
        {
            title: "Waiting for Interview",
            value: 22,
            icon: <IconClockHour4 size={28} />,
            color: "text-yellow-600",
            bg: "bg-yellow-100 dark:bg-yellow-900/30",
        },
    ];

    return (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {kpiData.map((item, index) => (
                <Card
                    key={index}
                    className="relative overflow-hidden border border-border
          bg-background/60 backdrop-blur-md
          shadow-sm hover:shadow-md transition-all duration-300"
                >
                    <CardContent className="flex items-center justify-between p-6">
                        <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">
                                {item.title}
                            </p>
                            <h2 className="text-3xl font-bold">
                                {item.value}
                            </h2>
                        </div>

                        <div
                            className={`p-3 rounded-xl ${item.bg} ${item.color}
              shadow-[inset_0_2px_6px_rgba(0,0,0,0.15)]`}
                        >
                            {item.icon}
                        </div>
                    </CardContent>

                    {/* subtle top highlight */}
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-border to-transparent opacity-40" />
                </Card>
            ))}
        </div>
    );
}