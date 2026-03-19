"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
    DndContext,
    closestCorners,
    DragOverlay,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    SortableContext,
    verticalListSortingStrategy,
    arrayMove,
} from "@dnd-kit/sortable";
import SortableItem from "@/components/sortable-item";
import { IconCircleCheckFilled, IconCircleDashed, IconCircleXFilled, IconProgress, IconLoader2, IconBookmark, IconStar, IconGhost } from '@tabler/icons-react';
import { getApplications, getApplicationStatuses, updateApplication } from "@/api/applications";

// Map known status names to icons
const getStatusIcon = (name) => {
    const n = (name || "").toLowerCase();
    if (n === "in-progress" || n === "interviewing")
        return <IconProgress className="text-yellow-500" size={16} />;
    if (n === "accepted" || n === "offered")
        return <IconCircleCheckFilled className="text-green-500" size={16} />;
    if (n === "rejected")
        return <IconCircleXFilled className="text-red-500" size={16} />;
    if (n === "bookmarked")
        return <IconBookmark className="text-indigo-400" size={16} />;
    if (n === "assessment")
        return <IconStar className="text-amber-500" size={16} />;
    if (n === "ghosted")
        return <IconGhost className="text-slate-400" size={16} />;
    if (n === "applied")
        return <IconCircleCheckFilled className="text-blue-500" size={16} />;
    return <IconCircleDashed className="text-muted-foreground" size={16} />;
};

// Normalise a raw application to the shape SortableItem expects
const normaliseApp = (app) => ({
    id: String(app.id),
    _rawId: app.id,
    title: app.company_name,
    role: app.role_title,
    url: app.job_url || "",
    appliedDate: app.applied_on
        ? new Date(app.applied_on).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
        : app.modified
        ? new Date(app.modified).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
        : "N/A",
    statusId: app.status,
});

export default function KanbanBoard() {
    const [statuses, setStatuses] = useState([]); // [{id, name, order}]
    const [columns, setColumns] = useState({}); // { statusId: [normalised apps] }
    const [loading, setLoading] = useState(true);
    const [activeItem, setActiveItem] = useState(null);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
    );

    const loadData = useCallback(async () => {
        try {
            setLoading(true);
            const [statusesData, appsData] = await Promise.all([
                getApplicationStatuses(),
                getApplications(),
            ]);

            const statusList = Array.isArray(statusesData)
                ? statusesData
                : (statusesData?.results ?? []);

            const appList = Array.isArray(appsData)
                ? appsData
                : (appsData?.results ?? []);

            // Build column map keyed by status ID
            const colMap = {};
            statusList.forEach((s) => {
                colMap[s.id] = [];
            });

            // Place each application into the right column
            appList.forEach((app) => {
                const sid = app.status;
                if (sid !== null && sid !== undefined && colMap[sid] !== undefined) {
                    colMap[sid].push(normaliseApp(app));
                }
            });

            // Sort items within each column by priority_order if desired
            Object.keys(colMap).forEach((sid) => {
                colMap[sid].sort((a, b) => (a.priority_order ?? 0) - (b.priority_order ?? 0));
            });

            setStatuses(statusList);
            setColumns(colMap);
        } catch (err) {
            console.error("Failed to load Kanban data:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    // Find which status column an item belongs to
    const findColumnId = (itemId) => {
        return Object.keys(columns).find((sid) =>
            columns[sid].some((item) => item.id === itemId)
        );
    };

    const handleDragStart = (event) => {
        const { active } = event;
        const colId = findColumnId(active.id);
        if (colId) {
            const item = columns[colId].find((i) => i.id === active.id);
            setActiveItem(item);
        }
    };

    const handleDragEnd = async (event) => {
        const { active, over } = event;
        setActiveItem(null);
        if (!over) return;

        const sourceColId = findColumnId(active.id);
        // over.id might be a column ID (string of numeric) or an item ID
        const destColId = findColumnId(over.id) || String(over.id);

        if (!sourceColId || !destColId) return;

        if (sourceColId === destColId) {
            // Reorder within same column
            const items = columns[sourceColId];
            const oldIndex = items.findIndex((i) => i.id === active.id);
            const newIndex = items.findIndex((i) => i.id === over.id);
            if (oldIndex === newIndex) return;

            setColumns((prev) => ({
                ...prev,
                [sourceColId]: arrayMove(items, oldIndex, newIndex),
            }));
        } else {
            // Move to a different column → update status via API
            const sourceItems = [...columns[sourceColId]];
            const destItems = [...columns[destColId]];
            const movedItem = sourceItems.find((i) => i.id === active.id);
            if (!movedItem) return;

            // Optimistic update in UI
            setColumns((prev) => ({
                ...prev,
                [sourceColId]: sourceItems.filter((i) => i.id !== active.id),
                [destColId]: [...destItems, { ...movedItem, statusId: Number(destColId) }],
            }));

            // Persist status change to backend
            try {
                await updateApplication(movedItem._rawId, { status: Number(destColId) });
            } catch (err) {
                console.error("Failed to update application status:", err);
                // Revert on error
                loadData();
            }
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <IconLoader2 size={28} className="animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className="grid gap-6 w-full" style={{ gridTemplateColumns: `repeat(${statuses.length}, minmax(255px, 1fr))` }}>
                {statuses.map((status) => {
                    const items = columns[status.id] ?? [];
                    return (
                        <div
                            key={status.id}
                            id={String(status.id)}
                            className="flex flex-col min-w-[255px] border border-dashed border-muted rounded-lg p-2"
                        >
                            {/* Column Header */}
                            <div className="flex items-center justify-between px-2 mb-4">
                                <div className="flex items-center gap-2">
                                    {getStatusIcon(status.name)}
                                    <span className="text-sm font-medium">{status.name}</span>
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
                    );
                })}
            </div>

            {/* Drag overlay for ghost card while dragging */}
            <DragOverlay>
                {activeItem ? (
                    <div className="opacity-90 shadow-xl rotate-1">
                        <SortableItem id={activeItem.id} item={activeItem} />
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}