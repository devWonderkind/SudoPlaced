"use client";
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    IconCalendarEvent,
    IconWorld,
    IconClock,
    IconUser,
    IconAlertCircle,
    IconMessageCircle2,
    IconChevronDown
} from '@tabler/icons-react';

const InterviewCard = ({
    time,
    status,
    type,
    id,
    timezone,
    duration,
    interviewer,
    colorSide
}) => {
    const isOverdue = status === "Overdue";

    return (
        <Card className="relative overflow-hidden border-l-0 mb-4 shadow-sm">

            <CardContent className="p-5 pl-7">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                    {/* Time and Status Row */}
                    <h3 className="text-md font-bold">{time}</h3>

                    <Badge
                        variant="secondary"
                        className={`flex items-center gap-1 px-2 py-0.5 rounded-md font-medium text-xs
              ${isOverdue ? 'bg-red-100 text-red-700 hover:bg-red-100' : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-100'}`}
                    >
                        {isOverdue ? <IconAlertCircle size={14} /> : <IconCalendarEvent size={14} />}
                        {status}
                        <IconChevronDown size={14} className="ml-1 opacity-70" />
                    </Badge>

                    {type && (
                        <Badge variant="outline" className="flex items-center gap-1 border-blue-200 bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full text-xs font-semibold">
                            <IconMessageCircle2 size={14} fill="currentColor" className="text-blue-600" />
                            {type}
                        </Badge>
                    )}
                </div>

                {/* Metadata Row */}
                <div className="flex items-center gap-4 text-slate-500 text-sm mb-4 font-medium">
                    {/* <span className="flex items-center gap-1">ID: <span className="text-slate-900">{id}</span></span> */}
                    <span className="flex items-center gap-1">
                        <IconWorld size={16} className="" /> {timezone}
                    </span>
                    <span className="flex items-center gap-1">
                        <IconClock size={16} className="" /> {duration}
                    </span>
                </div>

                {/* Interviewer Row */}
                <div className="flex items-center gap-2 text-sm text-slate-400">
                    <IconUser size={18} />
                    <span>Interviewer:</span>
                    <div className="flex items-center gap-2 ml-1">
                        <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] text-white font-bold
                ${interviewer.startsWith('L') ? 'bg-emerald-500' : 'bg-blue-500'}`}
                        >
                            {interviewer.charAt(0)}
                        </div>
                        <span className="font-medium">{interviewer}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default function InterviewList() {
    const interviews = [
        {
            time: "2:00 PM – 3:00 PM",
            status: "Scheduled",
            timezone: "GMT+8",
            duration: "1 hour",
            interviewer: "Aakanksha",
            colorSide: "#7c3aed" // Purple
        },
        {
            time: "12:30 PM – 1:30 PM",
            status: "Overdue",
            timezone: "GMT+8",
            duration: "1 hour",
            interviewer: "Devang Shaurya",
            colorSide: "#dc2626" // Red
        }
    ];

    return (
        <div className="w-full p-6 min-h-screen">
            {interviews.map((item) => (
                <InterviewCard key={item.id} {...item} />
            ))}
        </div>
    );
}