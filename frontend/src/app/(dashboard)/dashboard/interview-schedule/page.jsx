"use client"

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import InterviewList from "@/components/interview-card";
import InterviewModal from "@/components/interviewScheduleModal";
export default function InterviewSchedulePage() {
    const [showModal, setShowModal] = useState(false);
    const [interviews, setInterviews] = useState([]);


    return (
        <div className="p-2 space-y-6 border rounded-md w-full h-full">
            <Tabs defaultValue="schedule">
                <div className="flex justify-between sm:flex-row flex-col ml-6 p-2 space-y-6">
                    <TabsList className="w-full sm:w-auto">
                        <TabsTrigger value="schedule">Schedule
                            <Badge className="bg-yellow-500 rounded-sm">3</Badge>
                        </TabsTrigger>
                        <TabsTrigger value="all">All
                            <Badge className="bg-blue-500 rounded-sm">10</Badge>
                        </TabsTrigger>
                        <TabsTrigger value="completed">Completed
                            <Badge className="bg-green-500 rounded-sm">0</Badge>
                        </TabsTrigger>
                        <TabsTrigger value="rescheduled">Rescheduled
                            <Badge className="bg-gray-500 rounded-sm">0</Badge>
                        </TabsTrigger>
                        <TabsTrigger value="overdue">Overdue
                            <Badge className="bg-red-500 rounded-sm">2</Badge>
                        </TabsTrigger>
                    </TabsList>
                    <div className="flex justify-end sm:justify-start">
                        <InterviewModal open={showModal} setOpen={setShowModal} onClose={() => setShowModal(false)} />
                    </div>
                </div>
                <TabsContent value="schedule">
                    <InterviewList />
                </TabsContent>
                <TabsContent value="all">
                    <InterviewList />
                </TabsContent>
                <TabsContent value="completed">
                    <InterviewList />
                </TabsContent>
                <TabsContent value="rescheduled">
                    <InterviewList />
                </TabsContent>
                <TabsContent value="overdue">
                    <InterviewList />
                </TabsContent>
            </Tabs>



        </div>
    );
}