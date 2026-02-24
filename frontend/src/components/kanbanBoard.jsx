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
import { IconDots, IconPlus, IconCircleCheckFilled, IconCircleDashed, IconCircleXFilled, IconLoaderQuarter } from '@tabler/icons-react';

const initialData = {
    "In-Progress": [
        { id: "1", title: "Google - Frontend" },
        { id: "2", title: "Amazon - SDE" },
    ],
    Accepted: [{ id: "3", title: "Meta - React Dev" }],
    Rejected: [{ id: "4", title: "Netflix - UI Eng" }],
    Offered: [],
};

const statusConfig = {
    "In Progress": { icon: <IconLoaderQuarter className="text-yellow-500" size={16} />, count: 1 },
    "Done": { icon: <IconCircleCheckFilled className="text-indigo-500" size={16} />, count: 6 },
    "Canceled": { icon: <IconCircleXFilled className="text-slate-500" size={16} />, count: 4 },
};

export default function KanbanBoard() {
    const [columns, setColumns] = useState(initialData);

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
        <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-[#0c0d0e] min-h-screen text-slate-300">
                {Object.entries(columns).map(([column, items]) => (
                    <div key={column} className="flex flex-col min-w-[300px]">
                        {/* Column Header */}
                        <div className="flex items-center justify-between px-2 mb-4">
                            <div className="flex items-center gap-2">
                                {statusConfig[column]?.icon || <IconCircleDashed size={16} />}
                                <span className="text-sm font-medium text-slate-200">{column}</span>
                                <span className="text-xs text-slate-500 ml-1">{items.length}</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-500">
                                <IconDots size={16} className="cursor-pointer hover:text-slate-300" />
                                <IconPlus size={16} className="cursor-pointer hover:text-slate-300" />
                            </div>
                        </div>

                        {/* Column Body */}
                        <div className="flex-1 space-y-3">
                            <SortableContext
                                items={items.map((item) => item.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                {items.map((item) => (
                                    <SortableItem
                                        key={item.id}
                                        id={item.id}
                                        item={item} // Pass the whole item for metadata
                                    />
                                ))}
                            </SortableContext>
                        </div>
                    </div>
                ))}
            </div>
        </DndContext>
    );
}