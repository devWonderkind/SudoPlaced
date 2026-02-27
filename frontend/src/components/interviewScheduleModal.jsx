"use client";

import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import {
    IconCalendar,
    IconVideo, IconLink,
} from "@tabler/icons-react";
import { Plus } from 'lucide-react';
import { cn } from "@/lib/utils";

export default function CreateInterviewModal({ open, onClose, setOpen }) {
    const [date, setDate] = useState(new Date());
    const [searchTerm, setSearchTerm] = useState("");

    const [interviewType, setInterviewType] = useState("virtual");

    // Mock data for application selection
    const applications = [
        { id: "7781", company: "Google", role: "Frontend Engineer" },
        { id: "7782", company: "Meta", role: "Product Designer" },
        { id: "7783", company: "Amazon", role: "SDE II" },
    ];

    const filteredApps = applications.filter((app) =>
        `${app.company} ${app.role}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Dialog open={open} onOpenChange={setOpen} >
            <DialogTrigger asChild>
                <Button onClick={() => setOpen(true)}>
                    <Plus />
                    Create Interview</Button>
            </DialogTrigger>
            <DialogContent className="p-0 gap-0 overflow-hidden border-none sm:rounded-2xl">
                <div className="flex flex-col md:flex-row h-full max-h-[90vh]">

                    <div className="flex-1 p-6 overflow-y-auto">
                        <DialogHeader className="mb-6">
                            <DialogTitle className="text-xl font-bold">Create Interview</DialogTitle>
                            <p className="text-sm text-muted-foreground">Schedule a new session with the candidate.</p>
                        </DialogHeader>

                        <div className="space-y-5">
                            {/* 1. Select Application with Search */}
                            <div className="space-y-2">
                                <Label>Select Application</Label>
                                <Select>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Search application..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {/* <div className="flex items-center px-3 pb-2 border-b">
                                            <IconSearch size={16} className="mr-2 text-muted-foreground" />
                                            <input
                                                className="flex h-8 w-full bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground"
                                                placeholder="Type to filter..."
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                            />
                                        </div> */}
                                        {/* {filteredApps.map((app) => (
                                            <SelectItem key={app.id} value={app.id}>
                                                {app.company} - {app.role}
                                            </SelectItem>
                                        ))} */}

                                        <SelectItem value="7781">
                                            Google - Frontend Engineer
                                        </SelectItem>
                                        <SelectItem value="7782">
                                            Meta - Product Designer
                                        </SelectItem>
                                        <SelectItem value="7783">
                                            Amazon - SDE II
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* 2. Date Picker */}
                            <div className="space-y-2">
                                <Label>Interview Date</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}>
                                            <IconCalendar className="mr-2 h-4 w-4" />
                                            {date ? format(date, "PPP") : <span>Pick a date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                                    </PopoverContent>
                                </Popover>
                            </div>

                            {/* 3. Timezone & Times */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2 col-span-2">
                                    <Label>Time Zone</Label>
                                    <Select defaultValue="gmt8">
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="gmt8">(GMT+08:00) Singapore, Beijing</SelectItem>
                                            <SelectItem value="utc">(UTC+00:00) London</SelectItem>
                                            <SelectItem value="ist">(GMT+05:30) India Standard Time</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Start Time</Label>
                                    <Input type="time" defaultValue="11:00" />
                                </div>
                                <div className="space-y-2">
                                    <Label>End Time</Label>
                                    <Input type="time" defaultValue="12:00" />
                                </div>
                            </div>


                            {/* 4. Type & Interviewer - Updated to Stack for Full Width */}
                            <div className="space-y-4">


                                {/* Interview Type - Full Width */}
                                <div className="space-y-2">
                                    <Label>Interview Type</Label>
                                    <Select
                                        defaultValue="virtual"
                                        onValueChange={(value) => setInterviewType(value)}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="virtual">
                                                <div className="flex items-center gap-2">
                                                    <IconVideo size={16} className="text-slate-500" />
                                                    <span>Virtual (Online)</span>
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="onsite">
                                                <div className="flex items-center gap-2">
                                                    <IconLink size={16} className="text-slate-500" />
                                                    <span>On-site (Physical)</span>
                                                </div>
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Conditional URL Input - Only shows if type is virtual */}
                                {interviewType === "virtual" && (
                                    <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                                        <Label htmlFor="meet-url" className="">
                                            Meeting URL
                                        </Label>
                                        <div className="relative">
                                            <IconLink
                                                size={16}
                                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                            />
                                            <Input
                                                id="meet-url"
                                                placeholder="https://meet.google.com/abc-defg-hij"
                                                className="pl-10"
                                            />
                                        </div>

                                    </div>
                                )}
                            </div>
                            {/* Interviewer Name - Full Width */}
                            <div className="space-y-2">
                                <Label htmlFor="interviewer">Interviewer Name (Optional)</Label>
                                <Input id="interviewer" placeholder="e.g. Lydia Workman" className="w-full" />
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 mt-8">
                            <Button variant="ghost" onClick={onClose}>Cancel</Button>
                            <Button>Save Interview</Button>
                        </div>
                    </div>

                </div>
            </DialogContent>
        </Dialog>

    );
}