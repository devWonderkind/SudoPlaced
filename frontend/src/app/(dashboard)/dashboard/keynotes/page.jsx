"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    IconNotebook,
    IconBuildingCommunity,
    IconBriefcase,
    IconClock,
    IconArrowRight,
    IconSparkles,
    IconFileText,
} from "@tabler/icons-react";

// Mock data matching the interview data
const completedInterviews = [
    {
        id: 3,
        time: "10:00 AM – 11:00 AM",
        status: "Completed",
        type: "Technical",
        companyName: "Amazon",
        role: "Frontend Developer",
        interviewer: "Rahul Sharma",
        duration: "1 hour",
    },
    {
        id: 4,
        time: "3:00 PM – 4:00 PM",
        status: "Completed",
        type: "HR Round",
        companyName: "Meta",
        role: "Product Engineer",
        interviewer: "Priya Patel",
        duration: "1 hour",
    },
];

export default function KeynotesPage() {
    const [savedNotes, setSavedNotes] = useState({});

    useEffect(() => {
        // Check localStorage for saved notes
        const notes = {};
        completedInterviews.forEach((interview) => {
            const saved = localStorage.getItem(`keynote-${interview.id}`);
            if (saved) {
                notes[interview.id] = true;
            }
        });
        setSavedNotes(notes);
    }, []);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                    <IconNotebook size={24} className="text-indigo-500" />
                    Keynotes
                </h1>
                <p className="text-sm text-muted-foreground">
                    Manage your interview notes and takeaways. Capture key insights
                    from completed interviews.
                </p>
            </div>

            {/* Notes Grid */}
            {completedInterviews.length === 0 ? (
                <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="p-4 rounded-full bg-muted mb-4">
                            <IconFileText
                                size={40}
                                className="text-muted-foreground"
                            />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-1">
                            No keynotes yet
                        </h3>
                        <p className="text-sm text-muted-foreground max-w-sm">
                            Complete an interview and add keynotes to start
                            building your interview insights.
                        </p>
                        <Button variant="outline" className="mt-4" asChild>
                            <Link href="/dashboard/interview-schedule">
                                Go to Interview Schedule
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {completedInterviews.map((interview) => (
                        <Link
                            key={interview.id}
                            href={`/dashboard/keynotes/${interview.id}`}
                            className="group block"
                        >
                            <Card className="relative overflow-hidden border border-border/60 shadow-sm hover:shadow-md transition-all duration-300 h-full">
                                {/* Gradient accent */}
                                {/* <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" /> */}

                                <CardContent className="p-5 space-y-4">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2.5 rounded-xl border border-border/60 text-indigo-500">
                                                <IconNotebook size={22} />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-foreground text-base">
                                                    {interview.companyName}
                                                </h3>
                                                <p className="text-xs text-muted-foreground">
                                                    {interview.role}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {savedNotes[interview.id] && (
                                                <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-[10px] px-1.5">
                                                    <IconSparkles
                                                        size={10}
                                                        className="mr-0.5"
                                                    />
                                                    Saved
                                                </Badge>
                                            )}
                                            {interview.type && (
                                                <Badge
                                                    variant="outline"
                                                    className="text-[10px] border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-800 dark:bg-indigo-950 dark:text-indigo-300"
                                                >
                                                    {interview.type}
                                                </Badge>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                            <IconBuildingCommunity size={13} />
                                            {interview.companyName}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <IconClock size={13} />
                                            {interview.time}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between pt-2 border-t border-border/40">
                                        <span className="text-xs text-muted-foreground">
                                            {savedNotes[interview.id]
                                                ? "Edit keynotes"
                                                : "Add keynotes"}
                                        </span>
                                        <span className="flex items-center gap-1 text-xs font-medium text-indigo-500 group-hover:text-indigo-600 transition-colors">
                                            Open
                                            <IconArrowRight
                                                size={14}
                                                className="transition-transform duration-200 group-hover:translate-x-0.5"
                                            />
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}