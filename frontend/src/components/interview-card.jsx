"use client";
import React from 'react';
import Link from 'next/link';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    IconCalendarEvent,
    IconWorld,
    IconClock,
    IconUser,
    IconAlertCircle,
    IconMessageCircle2,
    IconChevronDown,
    IconBuildingCommunity,
    IconBriefcase,
    IconNotebook
} from '@tabler/icons-react';

const InterviewCard = ({
    time,
    status,
    type,
    id,
    companyName,
    role,
    timezone,
    duration,
    interviewer,
    colorSide
}) => {
    const isOverdue = status === "Overdue";
    const isCompleted = status === "Completed";

    return (
        <Card className="relative overflow-hidden border-l-0 mb-2 shadow-sm">

            <CardContent className="p-0 flex flex-col md:flex-row">
                {/* LEFT SECTION: Schedule & Interviewer */}
                <div className="flex-1 p-5 pl-7">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                        <h3 className="text-md font-bold text-foreground">{time}</h3>

                        <Badge
                            variant="secondary"
                            className={`flex items-center gap-1 px-2 py-0.5 rounded-md font-medium text-xs
                ${isOverdue ? 'bg-red-100 text-red-700' : isCompleted ? 'bg-green-100 text-green-700' : 'bg-indigo-100 text-indigo-700'}`}
                        >
                            {isOverdue ? <IconAlertCircle size={14} /> : <IconCalendarEvent size={14} />}
                            {status}

                        </Badge>

                        {type && (
                            <Badge variant="outline" className="flex items-center gap-1 border-blue-200 bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full text-xs font-semibold">
                                <IconMessageCircle2 size={14} fill="currentColor" className="text-blue-600" />
                                {type}
                            </Badge>
                        )}
                    </div>

                    <div className="flex items-center gap-4 text-muted-foreground text-sm mb-4 font-medium">
                        <span className="flex items-center gap-1"><IconWorld size={16} /> {timezone}</span>
                        <span className="flex items-center gap-1"><IconClock size={16} /> {duration}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <IconUser size={18} />
                        <span>Interviewer:</span>
                        <div className="flex items-center gap-2 ml-1">
                            <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] text-white font-bold bg-indigo-500">
                                {interviewer.charAt(0)}
                            </div>
                            <span className="font-medium text-foreground">{interviewer}</span>
                        </div>
                    </div>
                </div>

                {/* MIDDLE DIVIDER (Visible on Desktop) */}
                <div className="hidden md:block w-[1px] bg-border my-4" />

                {/* RIGHT SECTION: Job Details */}
                <div className="flex-1 p-5 bg-muted/20 md:bg-transparent">
                    <div className="space-y-3">
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-background border rounded-md text-muted-foreground">
                                <IconBuildingCommunity size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Company</p>
                                <h4 className="text-sm font-bold text-foreground">{companyName}</h4>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-background border rounded-md text-muted-foreground">
                                <IconBriefcase size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Position</p>
                                <h4 className="text-sm font-medium text-foreground">{role}</h4>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ADD KEYNOTES BUTTON for Completed interviews */}
                {isCompleted && (
                    <div className="absolute top-3 right-3 z-10">
                        <Link
                            href={`/dashboard/keynotes/${id}`}
                            className="group flex items-center gap-1.5 px-3 py-1.5 border border-border/60 bg-primary/10 text-primary rounded-full text-xs font-semibold shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
                            title="Add Keynotes"
                        >
                            <IconNotebook size={14} className="transition-transform duration-200 group-hover:rotate-6" />
                            Add Keynotes
                        </Link>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default function InterviewList() {
    const interviews = [
        {
            id: 1,
            time: "2:00 PM – 3:00 PM",
            status: "Scheduled",
            timezone: "GMT+8",
            duration: "1 hour",
            interviewer: "Aakanksha",
            companyName: "Google",
            role: "Software Engineer"
        },
        {
            id: 2,
            time: "12:30 PM – 1:30 PM",
            status: "Overdue",
            timezone: "GMT+8",
            duration: "1 hour",
            interviewer: "Devang Shaurya",
            companyName: "Microsoft",
            role: "Software Engineer"
        },
        {
            id: 3,
            time: "10:00 AM – 11:00 AM",
            status: "Completed",
            type: "Technical",
            timezone: "GMT+5:30",
            duration: "1 hour",
            interviewer: "Rahul Sharma",
            companyName: "Amazon",
            role: "Frontend Developer"
        },
        {
            id: 4,
            time: "3:00 PM – 4:00 PM",
            status: "Completed",
            type: "HR Round",
            timezone: "GMT+5:30",
            duration: "1 hour",
            interviewer: "Priya Patel",
            companyName: "Meta",
            role: "Product Engineer"
        }
    ];

    return (
        <div className="w-full min-h-screen">
            {interviews.map((item) => (
                <InterviewCard key={item.id} {...item} />
            ))}
        </div>
    );
}