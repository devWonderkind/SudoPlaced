import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import InterviewList from "@/components/interview-card";
export default function InterviewSchedulePage() {
    return (
        <div className="p-2 space-y-6 border rounded-md w-full h-full">

            <Tabs defaultValue="schedule" className="">
                <div className="flex justify-between p-2 space-y-6">
                    <TabsList>
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
                    <div className="flex justify-end">
                        <Button>Create Interview</Button>
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