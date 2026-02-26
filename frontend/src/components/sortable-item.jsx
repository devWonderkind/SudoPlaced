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
            <Card className="p-2 transition-colors cursor-grab active:cursor-grabbing hover:bg-slate-50/5">
                {/* 1 & 2. Company & Role Stacked tightly */}
                <div className="flex flex-col mb-2">
                    <h3 className="text-xs font-bold truncate leading-tight">
                        {item.title || "Unknown Company"}
                    </h3>
                    <div className="flex items-center gap-1 mt-2">
                        <IconBriefcase size={11} className="text-slate-500 shrink-0" />
                        <span className="text-[12px] text-slate-400 font-medium truncate">
                            {item.role || "Role not mentioned"}
                        </span>
                    </div>
                </div>

                {/* 3 & 4. Metadata Row (Compact Link & Date) */}
                <div className="flex items-center justify-between gap-1">
                    {item.url ? (
                        <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-1 text-blue-500 hover:text-blue-600 transition-colors"
                        >
                            <Badge variant="outline" className="bg-muted text-blue-400 border-muted hover:bg-blue-500/10 font-normal px-2 py-0 h-6 flex gap-1 items-center">
                                <IconExternalLink size={12} />
                                <span className="text-[10px]">Job Link</span>
                            </Badge>
                        </a>
                    ) : (
                        <span className="text-[10px] text-slate-400 italic">No URL</span>
                    )}

                    <div className="flex items-center gap-1 text-slate-500 shrink-0">
                        <IconCalendarEvent size={11} />
                        <span className="text-[10px] tabular-nums">
                            {item.appliedDate || "N/A"}
                        </span>
                    </div>
                </div>
            </Card>
        </div>
    );
}