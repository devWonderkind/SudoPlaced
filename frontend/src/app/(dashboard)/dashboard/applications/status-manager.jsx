"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, Trash2, GripVertical, Plus } from "lucide-react"; // Import necessary icons
import { toast } from "sonner";
import {
  getApplicationStatuses,
  restoreDefaultStatuses
} from "@/api/applications";
import api from "@/api"; // Assuming axios instance is exported as default

// Helper API calls specifically for this component if not in main api file
const createStatus = (data) => api.post("statuses/", data).then(res => res.data);
const updateStatus = ({id, data}) => api.patch(`statuses/${id}/`, data).then(res => res.data);
const deleteStatus = (id) => api.delete(`statuses/${id}/`).then(res => res.data);
const reorderStatuses = (updates) => api.post("statuses/reorder/", updates).then(res => res.data);


export function StatusManager() {
  const [open, setOpen] = useState(false);
  const [newStatusName, setNewStatusName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const queryClient = useQueryClient();

  const { data: statusData, isLoading } = useQuery({
    queryKey: ["statuses"],
    queryFn: getApplicationStatuses,
  });

  const statuses = statusData?.results || [];

  const restoreDefaultsMutation = useMutation({
      mutationFn: restoreDefaultStatuses,
      onSuccess: (data) => {
          queryClient.invalidateQueries(["statuses"]);
          toast.success(data.status || "Defaults restored");
      },
      onError: (err) => {
          toast.error("Failed to restore defaults");
          console.error(err);
      }
  });


  const createMutation = useMutation({
    mutationFn: createStatus,
    onSuccess: () => {
      queryClient.invalidateQueries(["statuses"]);
      setNewStatusName("");
      toast.success("Status created");
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateStatus,
    onSuccess: () => {
      queryClient.invalidateQueries(["statuses"]);
      setEditingId(null);
      toast.success("Status updated");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteStatus,
    onSuccess: () => {
      queryClient.invalidateQueries(["statuses"]);
      toast.success("Status deleted");
    },
    onError: () => {
        toast.error("Cannot delete status used by applications.");
    }
  });

  const handleAdd = () => {
    if (!newStatusName.trim()) return;
    createMutation.mutate({ name: newStatusName, order: statuses.length });
  };

  const handleUpdate = (id) => {
      if (!editingName.trim()) return;
      updateMutation.mutate({ id, data: { name: editingName } });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Settings className="h-4 w-4" />
          Manage Statuses
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Application Statuses</DialogTitle>
          <DialogDescription>
            Customize your workflow columns. Drag to reorder (Coming soon).
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
            {/* Add New */}
            <div className="flex gap-2">
                <Input 
                    placeholder="New Status Name..." 
                    value={newStatusName}
                    onChange={(e) => setNewStatusName(e.target.value)}
                />
                <Button onClick={handleAdd} disabled={createMutation.isPending} size="icon">
                    <Plus className="h-4 w-4"/>
                </Button>
            </div>

            {/* List */}
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                {statuses.length === 0 && !isLoading && (
                    <div className="flex flex-col items-center py-4 gap-2">
                        <p className="text-sm text-muted-foreground text-center">No statuses found.</p>
                        <Button 
                            variant="secondary" 
                            size="sm" 
                            onClick={() => restoreDefaultsMutation.mutate()}
                            disabled={restoreDefaultsMutation.isPending}
                        >
                            {restoreDefaultsMutation.isPending ? "Restoring..." : "Restore Defaults"}
                        </Button>
                    </div>
                )}
                {statuses.map((status) => (
                    <div key={status.id} className="flex items-center gap-2 border p-2 rounded-md bg-card">
                         {/* <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" /> */}
                         {editingId === status.id ? (
                             <Input 
                                value={editingName} 
                                onChange={(e) => setEditingName(e.target.value)}
                                className="h-8"
                                autoFocus
                             />
                         ) : (
                             <span className="flex-1 text-sm font-medium">{status.name}</span>
                         )}

                         <div className="flex gap-1 ml-auto">
                             {editingId === status.id ? (
                                 <Button size="xs" variant="ghost" onClick={() => handleUpdate(status.id)} className="h-8 px-2">Save</Button>
                             ) : (
                                 <Button size="xs" variant="ghost" onClick={() => {
                                     setEditingId(status.id);
                                     setEditingName(status.name);
                                 }} className="h-8 w-8 p-0"><Settings className="h-3 w-3"/></Button>
                             )}
                             
                             <Button 
                                size="xs" 
                                variant="ghost" 
                                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                onClick={() => deleteMutation.mutate(status.id)}
                            >
                                <Trash2 className="h-3 w-3"/>
                             </Button>
                         </div>
                    </div>
                ))}
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
