"use client";
import { useState, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import api from "@/api";

export default function ProfilePage() {
  const { user, setUser, logout } = useAuth();
  const fileInputRef = useRef(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState({
    full_name: user?.full_name || "",
  });

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append("profile_pic", file); // Matches Django model field

    try {
      setIsUpdating(true);
      const res = await api.patch("auth/users/me/", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUser(res.data);
      toast.success("Profile picture updated!");
    } catch (err) {
      toast.error("Failed to upload image.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setIsUpdating(true);
      const res = await api.patch("auth/users/me/", formData);
      setUser(res.data);
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error("Failed to update profile.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <Card className="border-border bg-card/60 backdrop-blur-xl">
        <CardHeader>
          <CardTitle>Your Profile</CardTitle>
          <CardDescription>Manage your Sudo Placed identity</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Avatar Section */}
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <Avatar className="h-24 w-24 border-2 border-border">
              <AvatarImage src={user?.profile_pic} alt={user?.full_name} />
              <AvatarFallback className="text-xl">{user?.full_name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => fileInputRef.current.click()}
                disabled={isUpdating}
              >
                Change Photo
              </Button>
              <input 
                type="file" 
                hidden 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
                accept="image/*" 
              />
              <p className="text-xs text-muted-foreground">JPG, GIF or PNG. 1MB Max.</p>
            </div>
          </div>

          {/* Form Section */}
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Email Address</label>
              <Input value={user?.email} disabled className="bg-muted/50 opacity-70" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Full Name</label>
              <Input 
                value={formData.full_name} 
                onChange={(e) => setFormData({...formData, full_name: e.target.value})} 
                className="bg-secondary/40 border-border"
              />
            </div>
            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={isUpdating} className="w-full sm:w-auto">
                {isUpdating ? "Saving..." : "Save Changes"}
              </Button>
              <Button 
                type="button" 
                variant="destructive" 
                onClick={logout}
                className="w-full sm:w-auto"
              >
                Logout
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}