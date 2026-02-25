"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import {
    DndContext,
    closestCorners,
} from "@dnd-kit/core";
import {
    SortableContext,
    verticalListSortingStrategy,
    arrayMove,
} from "@dnd-kit/sortable";
import SortableItem from "@/components/sortable-item";
import { IconCircleCheckFilled, IconCircleDashed, IconCircleXFilled, IconProgress } from '@tabler/icons-react';

const initialData = {
    "In-Progress": [
        {
            id: "1",
            title: "Google",
            role: "Frontend Developer",
            url: "https://google.com/careers",
            appliedDate: "Feb 24, 2026"
        },
        {
            id: "2",
            title: "Amazon",
            role: "SDE",
            url: "https://amazon.com/careers",
            appliedDate: "Feb 24, 2026"
        },

    ],
    "Accepted": [
        {
            id: "3",
            title: "Meta",
            role: "React Developer",
            url: "https://meta.com/careers",
            appliedDate: "Feb 24, 2026"
        },
    ],
    "Rejected": [
        {
            id: "4",
            title: "Netflix",
            role: "UI Engineer",
            url: "https://netflix.com/careers",
            appliedDate: "Feb 24, 2026"
        },
    ],
    "Offered": [],
    // ... other columns
};

const statusConfig = {
    "In-Progress": { icon: <IconProgress className="text-yellow-500" size={16} />, count: 1 },
    "Accepted": { icon: <IconCircleCheckFilled className="text-green-500" size={16} />, count: 6 },
    "Rejected": { icon: <IconCircleXFilled className="text-red-500" size={16} />, count: 4 },
    "Offered": { icon: <IconCircleCheckFilled className="text-blue-500" size={16} />, count: 6 },
};

export default function KanbanBoard() {
    const [columns, setColumns] = useState(initialData);
    const [activeCard, setActiveCard] = useState(null);

    const findColumn = (id) => {
        return Object.keys(columns).find((key) =>
            columns[key].some((item) => item.id === id)
        );
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (!over) return;

        const sourceColumn = findColumn(active.id);
        const destinationColumn = findColumn(over.id) || over.id;

        if (!sourceColumn || !destinationColumn) return;

        // Same column reorder
        if (sourceColumn === destinationColumn) {
            const items = columns[sourceColumn];
            const oldIndex = items.findIndex((i) => i.id === active.id);
            const newIndex = items.findIndex((i) => i.id === over.id);

            setColumns({
                ...columns,
                [sourceColumn]: arrayMove(items, oldIndex, newIndex),
            });
        }
        // Move to different column
        else {
            const sourceItems = [...columns[sourceColumn]];
            const destItems = [...columns[destinationColumn]];

            const movedItem = sourceItems.find((i) => i.id === active.id);

            setColumns({
                ...columns,
                [sourceColumn]: sourceItems.filter((i) => i.id !== active.id),
                [destinationColumn]: [...destItems, movedItem],
            });
        }
    };

    return (
        <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd} className="overflow-x-auto">
            <div className="grid grid-cols-4 gap-6 min-h-screen w-full">
                {Object.entries(columns).map(([column, items]) => (
                    <div key={column} className="flex flex-col min-w-[255px] border border-dashed border-muted rounded-lg p-2">
                        {/* Column Header */}
                        <div className="flex items-center justify-between px-2 mb-4">
                            <div className="flex items-center gap-2">
                                {statusConfig[column]?.icon || <IconCircleDashed size={16} />}
                                <span className="text-sm font-medium">{column}</span>
                                <span className="text-xs ml-1">{items.length}</span>
                            </div>
                        </div>

                        {/* Column Body */}
                        <div className="flex-1 space-y-3">
                            <SortableContext
                                items={items.map((item) => item.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                {items.length > 0 ? (
                                    items.map((item) => (
                                        <SortableItem
                                            key={item.id}
                                            id={item.id}
                                            item={item}
                                        />
                                    ))
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-[#26272b] rounded-lg bg-[#151618]/30">
                                        <span className="text-[11px] font-medium text-slate-600 uppercase tracking-wider">
                                            No application
                                        </span>
                                    </div>
                                )}
                            </SortableContext>
                        </div>
                    </div>
                ))}
            </div>
        </DndContext>
    );
}