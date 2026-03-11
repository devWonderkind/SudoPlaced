"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Editor } from "@/components/dynamic-editor";
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
    IconArrowLeft,
    IconDeviceFloppy,
    IconCheck,
    IconUser,
} from "@tabler/icons-react";

// Mock data - consistency with interview data
const interviewData = {
    1: {
        id: 1,
        time: "2:00 PM – 3:00 PM",
        status: "Scheduled",
        companyName: "Google",
        role: "Software Engineer",
        interviewer: "Aakanksha",
        duration: "1 hour",
    },
    2: {
        id: 2,
        time: "12:30 PM – 1:30 PM",
        status: "Overdue",
        companyName: "Microsoft",
        role: "Software Engineer",
        interviewer: "Devang Shaurya",
        duration: "1 hour",
    },
    3: {
        id: 3,
        time: "10:00 AM – 11:00 AM",
        status: "Completed",
        type: "Technical",
        companyName: "Amazon",
        role: "Frontend Developer",
        interviewer: "Rahul Sharma",
        duration: "1 hour",
    },
    4: {
        id: 4,
        time: "3:00 PM – 4:00 PM",
        status: "Completed",
        type: "HR Round",
        companyName: "Meta",
        role: "Product Engineer",
        interviewer: "Priya Patel",
        duration: "1 hour",
    },
};

const completedInterviews = Object.values(interviewData).filter(
    (item) => item.status === "Completed"
);

function KeynotesContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [selectedInterviewId, setSelectedInterviewId] = useState(null);
    const [savedNotes, setSavedNotes] = useState({});
    const [editorContent, setEditorContent] = useState(null);
    const [saved, setSaved] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const interviewId = searchParams.get("interviewId");
        if (interviewId && interviewData[interviewId]) {
            setSelectedInterviewId(interviewId);
        } else {
            setSelectedInterviewId(null);
        }
    }, [searchParams]);

    useEffect(() => {
        // Check localStorage for saved notes
        const notes = {};
        completedInterviews.forEach((interview) => {
            const savedNote = localStorage.getItem(`keynote-${interview.id}`);
            if (savedNote) {
                notes[interview.id] = true;
            }
        });
        setSavedNotes(notes);
    }, []);

    const handleEditorChange = useCallback((content) => {
        setEditorContent(content);
        setSaved(false);
    }, []);

    const handleSave = useCallback(() => {
        if (!selectedInterviewId) return;
        
        setSaving(true);
        if (editorContent) {
            localStorage.setItem(
                `keynote-${selectedInterviewId}`,
                JSON.stringify(editorContent)
            );
        }
        setTimeout(() => {
            setSaving(false);
            setSaved(true);
            setSavedNotes(prev => ({ ...prev, [selectedInterviewId]: true }));
            setTimeout(() => setSaved(false), 2500);
        }, 600);
    }, [editorContent, selectedInterviewId]);

    const handleSelectInterview = (id) => {
        router.push(`/dashboard/keynotes?interviewId=${id}`);
    };

    const handleBack = () => {
        router.push("/dashboard/keynotes");
    };

    if (selectedInterviewId) {
        const interview = interviewData[selectedInterviewId];
        return (
            <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Editor Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleBack}
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

                {/* Editor Section */}
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
                            Use '/' for commands • Markdown supported
                        </span>
                    </div>
                    <CardContent className="p-0 min-h-[500px]">
                        <Editor
                            key={selectedInterviewId} // Re-mount editor for different interview
                            onChange={handleEditorChange}
                            initialContent={JSON.parse(localStorage.getItem(`keynote-${selectedInterviewId}`) || "null")}
                        />
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
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
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {completedInterviews.map((interview) => (
                        <div
                            key={interview.id}
                            onClick={() => handleSelectInterview(interview.id)}
                            className="group block cursor-pointer"
                        >
                            <Card className="relative overflow-hidden border border-border/60 shadow-sm hover:shadow-md transition-all duration-300 h-full">
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
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function KeynotesPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <KeynotesContent />
        </Suspense>
    );
}