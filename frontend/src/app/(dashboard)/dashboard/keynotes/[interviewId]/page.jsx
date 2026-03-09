"use client";

import { useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Editor } from "@/components/dynamic-editor";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
    IconArrowLeft,
    IconDeviceFloppy,
    IconCalendarEvent,
    IconBuildingCommunity,
    IconBriefcase,
    IconUser,
    IconClock,
    IconNotebook,
    IconCheck,
    IconSparkles,
} from "@tabler/icons-react";

// Mock data - in production this would come from API
const interviewData = {
    1: {
        time: "2:00 PM – 3:00 PM",
        status: "Scheduled",
        companyName: "Google",
        role: "Software Engineer",
        interviewer: "Aakanksha",
        duration: "1 hour",
    },
    2: {
        time: "12:30 PM – 1:30 PM",
        status: "Overdue",
        companyName: "Microsoft",
        role: "Software Engineer",
        interviewer: "Devang Shaurya",
        duration: "1 hour",
    },
    3: {
        time: "10:00 AM – 11:00 AM",
        status: "Completed",
        type: "Technical",
        companyName: "Amazon",
        role: "Frontend Developer",
        interviewer: "Rahul Sharma",
        duration: "1 hour",
    },
    4: {
        time: "3:00 PM – 4:00 PM",
        status: "Completed",
        type: "HR Round",
        companyName: "Meta",
        role: "Product Engineer",
        interviewer: "Priya Patel",
        duration: "1 hour",
    },
};

export default function KeynoteEditorPage() {
    const params = useParams();
    const router = useRouter();
    const interviewId = params.interviewId;
    const interview = interviewData[interviewId];

    const [editorContent, setEditorContent] = useState(null);
    const [saved, setSaved] = useState(false);
    const [saving, setSaving] = useState(false);

    const handleEditorChange = useCallback((content) => {
        setEditorContent(content);
        setSaved(false);
    }, []);

    const handleSave = useCallback(() => {
        setSaving(true);
        // In production, save to backend
        // For now, save to localStorage
        if (editorContent) {
            localStorage.setItem(
                `keynote-${interviewId}`,
                JSON.stringify(editorContent)
            );
        }
        setTimeout(() => {
            setSaving(false);
            setSaved(true);
            setTimeout(() => setSaved(false), 2500);
        }, 600);
    }, [editorContent, interviewId]);

    if (!interview) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
                <div className="p-4 rounded-full bg-muted">
                    <IconNotebook size={48} className="text-muted-foreground" />
                </div>
                <h2 className="text-xl font-semibold text-foreground">
                    Interview not found
                </h2>
                <p className="text-sm text-muted-foreground">
                    The interview you&apos;re looking for doesn&apos;t exist.
                </p>
                <Button
                    variant="outline"
                    onClick={() => router.push("/dashboard/interview-schedule")}
                    className="mt-2"
                >
                    <IconArrowLeft size={16} className="mr-1" />
                    Back to Schedule
                </Button>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => router.back()}
                        className="p-2 rounded-lg border border-border hover:bg-muted transition-colors"
                        title="Go back"
                    >
                        <IconArrowLeft size={18} className="text-muted-foreground" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                            <IconNotebook
                                size={24}
                                className="text-indigo-500"
                            />
                            Interview Keynotes
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Capture important notes and takeaways from your
                            interview.
                        </p>
                    </div>
                </div>
                <Button
                    onClick={handleSave}
                    disabled={saving}
                    className={`relative overflow-hidden transition-all duration-300 ${
                        saved
                            ? "bg-green-500 hover:bg-green-600 text-white"
                            : "bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white"
                    }`}
                >
                    {saving ? (
                        <>
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
                            Saving...
                        </>
                    ) : saved ? (
                        <>
                            <IconCheck size={16} className="mr-1" />
                            Saved!
                        </>
                    ) : (
                        <>
                            <IconDeviceFloppy size={16} className="mr-1" />
                            Save Notes
                        </>
                    )}
                </Button>
            </div>

            {/* Interview Info Card */}
            <Card className="border border-border/60 shadow-sm bg-gradient-to-br from-card to-muted/20">
                <CardContent className="p-4">
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-md bg-indigo-500/10 text-indigo-500">
                                <IconBuildingCommunity size={16} />
                            </div>
                            <span className="font-semibold text-foreground">
                                {interview.companyName}
                            </span>
                        </div>

                        <div className="w-px h-5 bg-border hidden sm:block" />

                        <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-md bg-purple-500/10 text-purple-500">
                                <IconBriefcase size={16} />
                            </div>
                            <span className="text-muted-foreground">
                                {interview.role}
                            </span>
                        </div>

                        <div className="w-px h-5 bg-border hidden sm:block" />

                        <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-md bg-blue-500/10 text-blue-500">
                                <IconUser size={16} />
                            </div>
                            <span className="text-muted-foreground">
                                {interview.interviewer}
                            </span>
                        </div>

                        <div className="w-px h-5 bg-border hidden sm:block" />

                        <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-md bg-emerald-500/10 text-emerald-500">
                                <IconClock size={16} />
                            </div>
                            <span className="text-muted-foreground">
                                {interview.time}
                            </span>
                        </div>

                        {interview.type && (
                            <>
                                <div className="w-px h-5 bg-border hidden sm:block" />
                                <Badge
                                    variant="outline"
                                    className="border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-800 dark:bg-indigo-950 dark:text-indigo-300"
                                >
                                    {interview.type}
                                </Badge>
                            </>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Editor */}
            <Card className="border border-border/60 shadow-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-border/60 bg-muted/30 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <IconSparkles
                            size={16}
                            className="text-amber-500"
                        />
                        Notes Editor
                    </div>
                    <span className="text-xs text-muted-foreground/60">
                        Use &apos;/&apos; for commands • Markdown supported
                    </span>
                </div>
                <CardContent className="p-0 min-h-[500px]">
                    <Editor
                        onChange={handleEditorChange}
                    />
                </CardContent>
            </Card>
        </div>
    );
}
