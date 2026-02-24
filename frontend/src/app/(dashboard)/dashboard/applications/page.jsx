"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { IconLayoutKanban, IconTable } from "@tabler/icons-react";
import KanbanBoard from "@/components/kanbanBoard";
import ApplicationsTable from "@/components/data-table";

export default function ApplicationsPage() {
    const [view, setView] = useState("table");

    return (
        <div className="p-2 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div className="flex gap-2">
                    <Button
                        variant={view === "table" ? "default" : "outline"}
                        onClick={() => setView("table")}
                        className="gap-2"
                    >
                        <IconTable size={18} />
                        Table
                    </Button>
                    <Button
                        variant={view === "kanban" ? "default" : "outline"}
                        onClick={() => setView("kanban")}
                        className="gap-2"
                    >
                        <IconLayoutKanban size={18} />
                        Kanban
                    </Button>

                </div>
            </div>

            {/* Conditional View */}
            {view === "kanban" ? <KanbanBoard /> : <ApplicationsTable title="All Applications" />}
        </div>
    );
}