"use client";

import React, { useState, useMemo } from "react";
import {
    Table,
    TableHeader,
    TableBody,
    TableHead,
    TableRow,
    TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import AddApplicationModal from "@/components/applicationModal";

const users = [
    { id: 1, name: "Slack", role: "Frontend", status: "In-Progress", appliedOn: "2022-01-01" },
    { id: 2, name: "Linkedin", role: "Backend", status: "Rejected", appliedOn: "2022-01-02" },
    { id: 3, name: "Instagram", role: "UI/UX", status: "Offered", appliedOn: "2022-01-03" },
    { id: 4, name: "Twitter", role: "DevOps", status: "Accepted", appliedOn: "2022-01-04" },
];

export default function DataTable() {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [open, setOpen] = useState(false);

    const filteredUsers = useMemo(() => {
        return users.filter((user) => {
            const matchesSearch =
                user.name.toLowerCase().includes(search.toLowerCase()) ||
                user.role.toLowerCase().includes(search.toLowerCase());

            const matchesStatus =
                statusFilter === "all" || user.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [search, statusFilter]);

    return (
        <>
            <Card className="shadow-lg">
                <CardContent className="space-y-4">
                    {/* Search + Filter */}
                    <div className="flex flex-col sm:flex-row gap-2 justify-between items-center">
                        <h1 className="text-lg font-semibold px-2 py-2">Latest Applications</h1>
                        <div className="flex gap-2">
                            <Input
                                placeholder="Search by name or role..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="sm:w-1/2"
                            />

                            <Select onValueChange={setStatusFilter} defaultValue="all">
                                <SelectTrigger className="sm:w-48">
                                    <SelectValue placeholder="Filter by status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All</SelectItem>
                                    <SelectItem value="In-Progress">In Progress</SelectItem>
                                    <SelectItem value="Rejected">Rejected</SelectItem>
                                    <SelectItem value="Offered">Offered</SelectItem>
                                    <SelectItem value="Accepted">Accepted</SelectItem>
                                </SelectContent>
                            </Select>
                            {/* Modal */}
                            <AddApplicationModal open={open} setOpen={setOpen} />
                        </div>

                    </div>

                    {/* Table */}
                    <div className="rounded-sm">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Company Name</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Applied On</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {filteredUsers.length > 0 ? (
                                    filteredUsers.map((user) => (
                                        <TableRow key={user.id}>
                                            <TableCell className="font-medium">{user.name}</TableCell>
                                            <TableCell>{user.role}</TableCell>
                                            <TableCell>
                                                <span
                                                    className={`px-2 py-1 text-xs rounded-full
                        ${user.status === "In-Progress"
                                                            ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-700 dark:border-green-300"
                                                            : user.status === "Rejected"
                                                                ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-700 dark:border-red-300"
                                                                : user.status === "Offered"
                                                                    ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border border-yellow-700 dark:border-yellow-300"
                                                                    : "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-700 dark:border-blue-300"
                                                        }`}
                                                >
                                                    {user.status}
                                                </span>
                                            </TableCell>
                                            <TableCell>{user.appliedOn}</TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-6">
                                            No results found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </>
    );
}