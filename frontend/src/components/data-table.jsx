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

const users = [
    { id: 1, name: "Slack", role: "Frontend", status: "In-Progress" },
    { id: 2, name: "Linkedin", role: "Backend", status: "Rejected" },
    { id: 3, name: "Instagram", role: "UI/UX", status: "Offered" },
    { id: 4, name: "Twitter", role: "DevOps", status: "Accepted" },
];

export default function DataTable() {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

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

            <h1 className="text-lg font-bold my-4">Latest Applications</h1>

            <Card className="shadow-lg">
                <CardContent className="space-y-4">
                    {/* Search + Filter */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-between">
                        <Input
                            placeholder="Search by name or role..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="sm:w-1/2"
                        />
                        <div className="flex gap-2">

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
                            <Button>Add</Button>
                        </div>

                    </div>

                    {/* Table */}
                    <div className="rounded-sm border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Company Name</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Status</TableHead>
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
                                                            ? "bg-green-700 text-green-100"
                                                            : user.status === "Rejected"
                                                                ? "bg-red-700 text-red-100"
                                                                : user.status === "Offered"
                                                                    ? "bg-yellow-700 text-yellow-100"
                                                                    : "bg-blue-700 text-blue-100"
                                                        }`}
                                                >
                                                    {user.status}
                                                </span>
                                            </TableCell>
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