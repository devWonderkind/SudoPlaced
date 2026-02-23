"use client";

import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { IconPlus } from "@tabler/icons-react";

export default function AddApplicationModal({ open, setOpen }) {
    const [company, setCompany] = useState("");
    const [logoUrl, setLogoUrl] = useState("");
    const [role, setRole] = useState("");
    const [link, setLink] = useState("");
    const [date, setDate] = useState("");

    // Extract domain and fetch logo
    const handleCompanyChange = (value) => {
        setCompany(value);

        try {
            const domain = value
                .toLowerCase()
                .replace("https://", "")
                .replace("http://", "")
                .replace("www.", "")
                .split(" ")[0];

            if (domain.includes(".")) {
                setLogoUrl(`https://logo.clearbit.com/${domain}`);
            } else {
                setLogoUrl("");
            }
        } catch {
            setLogoUrl("");
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const newApplication = {
            company,
            logoUrl,
            role,
            link,
            date,
        };

        console.log("Submitted:", newApplication);

        // close modal after submit
        setOpen(false);

        // Reset form
        setCompany("");
        setLogoUrl("");
        setRole("");
        setLink("");
        setDate("");
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2">
                    <IconPlus size={18} />
                    Add
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[500px] backdrop-blur-md bg-background/80">
                <DialogHeader>
                    <DialogTitle>Add New Application</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-5 mt-4">

                    {/* Company Name */}
                    <div className="space-y-2">
                        <Label>Company Name</Label>
                        <div className="flex items-center gap-3">
                            {logoUrl && (
                                <img
                                    src={logoUrl}
                                    alt="Company Logo"
                                    className="w-10 h-10 rounded-md border object-contain bg-white"
                                />
                            )}
                            <Input
                                placeholder="e.g. google.com"
                                value={company}
                                onChange={(e) => handleCompanyChange(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {/* Role */}
                    <div className="space-y-2">
                        <Label>Role / Designation</Label>
                        <Input
                            placeholder="Frontend Developer"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            required
                        />
                    </div>

                    {/* Link */}
                    <div className="space-y-2">
                        <Label>Application Link</Label>
                        <Input
                            type="url"
                            placeholder="https://..."
                            value={link}
                            onChange={(e) => setLink(e.target.value)}
                        />
                    </div>

                    {/* Date Applied */}
                    <div className="space-y-2">
                        <Label>Date Applied</Label>
                        <Input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                        />
                    </div>

                    <Button type="submit" className="w-full mt-2">
                        Save Application
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}