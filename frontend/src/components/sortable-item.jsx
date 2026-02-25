"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IconExternalLink, IconCalendarEvent, IconBriefcase } from '@tabler/icons-react';

export default function SortableItem({ id, item }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
        zIndex: isDragging ? 50 : 0,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <Card className="p-4 transition-colors cursor-grab active:cursor-grabbing group">

                {/* 1. Company Name / Title */}
                <div className="flex justify-between items-start">
                    <h3 className="text-sm font-bold truncate">
                        {item.title || "Unknown Company"}
                    </h3>
                    {/* <div className="w-2 h-2 rounded-full bg-slate-600" /> */}
                </div>

                {/* 2. Role / Designation */}
                <div className="flex items-center gap-2 mb-2">
                    <IconBriefcase size={14} className="text-slate-500" />
                    <span className="text-xs text-slate-400 font-medium">
                        {item.role || "Role not mentioned"}
                    </span>
                </div>

                {/* Metadata Row */}
                <div className="flex flex-wrap items-center justify-between gap-2">

                    {/* 3. Job URL (Clickable Badge) */}
                    {item.url ? (
                        <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()} // Prevents drag start when clicking link
                        >
                            <Badge variant="outline" className="bg-muted text-blue-400 border-muted hover:bg-blue-500/10 font-normal px-2 py-0 h-6 flex gap-1 items-center">
                                <IconExternalLink size={12} />
                                <span className="text-[10px]">Job Link</span>
                            </Badge>
                        </a>
                    ) : (
                        <span className="text-[10px] text-slate-600 italic">No URL</span>
                    )}

                    {/* 4. Applied Date */}
                    <div className="flex items-center gap-1.5 text-slate-500">
                        <IconCalendarEvent size={12} />
                        <span className="text-[10px] font-medium">
                            {item.appliedDate || "N/A"}
                        </span>
                    </div>
                </div>
            </Card>
        </div>
    );
}