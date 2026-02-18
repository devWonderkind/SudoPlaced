"use client";
import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChangePasswordSchema, SetInitialPasswordSchema } from "@/schemas/auth";
import { useAuth } from "@/context/AuthContext";
import { useGoogleLogin } from "@react-oauth/google";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  IconBrandGoogleFilled,
  IconInfoCircle,
  IconLoader2,
  IconEye,
  IconEyeOff,
  IconCheck,
  IconLink,
} from "@tabler/icons-react";

/** Pick best available avatar src: custom upload → google pic → null */
function getAvatarSrc(user) {
  if (user?.profile_pic) return user.profile_pic;
  if (user?.google_profile_pic) return user.google_profile_pic;
  return null;
}

export default function ProfilePage() {
  const { user, updateUser, changePassword, setInitialPassword, connectGoogle, logout } = useAuth();
  const fileInputRef = useRef(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [fullName, setFullName] = useState(user?.full_name || "");

  // Derive state from user object
  const isGoogleConnected = Boolean(user?.google_profile_pic);
  const hasUsablePassword = user?.has_usable_password ?? true; // default true = safer

  // Change-password dialog
  const [pwOpen, setPwOpen] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Use different schema depending on whether user already has a password
  const pwForm = useForm({
    resolver: zodResolver(hasUsablePassword ? ChangePasswordSchema : SetInitialPasswordSchema),
    defaultValues: { current_password: "", new_password: "", re_new_password: "" },
  });

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const data = new FormData();
    data.append("profile_pic", file);
    try {
      setIsUpdating(true);
      await updateUser(data, true);
      toast.success("Profile picture updated!");
    } catch {
      toast.error("Failed to upload image.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setIsUpdating(true);
      await updateUser({ full_name: fullName });
      toast.success("Profile updated!");
    } catch {
      toast.error("Failed to update profile.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleChangePassword = async (values) => {
    try {
      if (hasUsablePassword) {
        // Regular change — Djoser set_password (requires current_password)
        await changePassword(values.current_password, values.new_password, values.re_new_password);
      } else {
        // Initial set — custom endpoint, no current_password needed
        await setInitialPassword(values.new_password, values.re_new_password);
      }
      toast.success(hasUsablePassword ? "Password changed successfully!" : "Password set successfully!");
      setPwOpen(false);
      pwForm.reset();
    } catch (err) {
      const data = err.response?.data;
      const msg =
        data?.current_password?.[0] ||
        data?.new_password?.[0] ||
        data?.re_new_password?.[0] ||
        data?.detail ||
        "Failed to save password.";
      toast.error(msg);
    }
  };

  const handleGoogleConnect = useGoogleLogin({
    onSuccess: (tokenResponse) => connectGoogle(tokenResponse.access_token),
    onError: () => toast.error("Google connection failed"),
  });

  return (
    <div className="max-w-2xl space-y-6">
      {/* ── Identity Card ─────────────────────────────────────────────────── */}
      <Card className="border-border bg-card/60 backdrop-blur-xl">
        <CardHeader>
          <CardTitle>Your Profile</CardTitle>
          <CardDescription>Manage your Sudo Placed identity</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <Avatar className="h-24 w-24 border-2 border-border">
              <AvatarImage src={getAvatarSrc(user)} alt={user?.full_name} />
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

          {/* Basic info form */}
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Email Address</label>
              <Input value={user?.email} disabled className="bg-muted/50 opacity-70" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Full Name</label>
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="bg-secondary/40 border-border"
              />
            </div>
            <div className="flex flex-wrap gap-3 pt-2">
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

      {/* ── Security Card ─────────────────────────────────────────────────── */}
      <Card className="border-border bg-card/60 backdrop-blur-xl">
        <CardHeader>
          <CardTitle>Security</CardTitle>
          <CardDescription>Manage your password and connected accounts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Password row */}
          <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/20 px-4 py-3">
            <div>
              <p className="text-sm font-medium">Password</p>
              <p className="text-xs text-muted-foreground">
                {!hasUsablePassword
                  ? "No password set — you sign in via Google only"
                  : "Change your account password"}
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={() => setPwOpen(true)}>
              {hasUsablePassword ? "Change Password" : "Set Password"}
            </Button>
          </div>

          {/* Google account row */}
          <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/20 px-4 py-3">
            <div className="flex items-center gap-3">
              <IconBrandGoogleFilled size={20} className="text-muted-foreground" />
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">Google Account</p>
                  {isGoogleConnected ? (
                    <Badge variant="secondary" className="gap-1 text-xs">
                      <IconCheck size={11} /> Connected
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs text-muted-foreground">
                      Not connected
                    </Badge>
                  )}
                  {/* Info popover — click to open */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                        aria-label="Google account info"
                      >
                        <IconInfoCircle size={15} />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64 text-sm" side="top">
                      {isGoogleConnected ? (
                        <p>
                          Your Google account is linked. You can sign in with Google on your next
                          visit, and your Google profile picture is used as a fallback avatar.
                        </p>
                      ) : (
                        <p>
                          Connect your Google account to enable one-click sign-in and use your
                          Google profile picture as a fallback avatar.
                        </p>
                      )}
                    </PopoverContent>
                  </Popover>
                </div>
                <p className="text-xs text-muted-foreground">
                  {isGoogleConnected
                    ? "Sign in with Google on your next visit"
                    : "Link Google for faster sign-in"}
                </p>
              </div>
            </div>

            {isGoogleConnected ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleGoogleConnect()}
                className="gap-2 text-muted-foreground hover:text-foreground"
              >
                <IconBrandGoogleFilled size={14} />
                Re-link
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleGoogleConnect()}
                className="gap-2"
              >
                <IconLink size={14} />
                Connect
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ── Change / Set Password Dialog ──────────────────────────────────── */}
      <Dialog open={pwOpen} onOpenChange={setPwOpen}>
        <DialogContent className="border-border bg-card/90 backdrop-blur-xl sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>
              {hasUsablePassword ? "Change Password" : "Set a Password"}
            </DialogTitle>
            <DialogDescription>
              {hasUsablePassword
                ? "Enter your current password, then choose a new one."
                : "You signed in with Google. Create a password to also enable email login."}
            </DialogDescription>
          </DialogHeader>

          <Form {...pwForm}>
            <form onSubmit={pwForm.handleSubmit(handleChangePassword)} className="space-y-4">
              {/* Current password — only shown when user already has one */}
              {hasUsablePassword && (
                <FormField
                  control={pwForm.control}
                  name="current_password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-muted-foreground">Current Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="••••••••"
                            type={showCurrent ? "text" : "password"}
                            {...field}
                            className="bg-secondary/40 border-border h-11 pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowCurrent(!showCurrent)}
                            className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2"
                          >
                            {showCurrent ? <IconEyeOff size={17} /> : <IconEye size={17} />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={pwForm.control}
                name="new_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground">New Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="••••••••"
                          type={showNew ? "text" : "password"}
                          {...field}
                          className="bg-secondary/40 border-border h-11 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNew(!showNew)}
                          className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2"
                        >
                          {showNew ? <IconEyeOff size={17} /> : <IconEye size={17} />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={pwForm.control}
                name="re_new_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground">Confirm New Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="••••••••"
                          type={showConfirm ? "text" : "password"}
                          {...field}
                          className="bg-secondary/40 border-border h-11 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirm(!showConfirm)}
                          className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2"
                        >
                          {showConfirm ? <IconEyeOff size={17} /> : <IconEye size={17} />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={pwForm.formState.isSubmitting}
                className="h-11 w-full font-bold"
              >
                {pwForm.formState.isSubmitting ? (
                  <>
                    <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Password"
                )}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}