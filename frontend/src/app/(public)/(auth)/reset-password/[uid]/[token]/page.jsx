"use client";

import { use, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResetPasswordConfirmSchema } from "@/schemas/auth";
import { confirmPasswordReset } from "@/api/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { IconLoader2, IconEye, IconEyeOff } from "@tabler/icons-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ResetPasswordConfirmPage({ params }) {
  const { uid, token } = use(params);
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const form = useForm({
    resolver: zodResolver(ResetPasswordConfirmSchema),
    defaultValues: { new_password: "", re_new_password: "" },
  });

  const onSubmit = async (values) => {
    try {
      await confirmPasswordReset(uid, token, values.new_password, values.re_new_password);
      toast.success("Password reset successful! You can now log in.");
      router.push("/login");
    } catch (err) {
      const msg =
        err.response?.data?.token?.[0] ||
        err.response?.data?.new_password?.[0] ||
        err.response?.data?.detail ||
        "Reset failed. The link may have expired.";
      toast.error(msg);
    }
  };

  return (
    <div className="bg-background flex min-h-screen w-full items-center justify-center p-4">
      <Card className="border-border bg-card/60 w-full max-w-md shadow-2xl backdrop-blur-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-extrabold">Set New Password</CardTitle>
          <CardDescription>Enter and confirm your new password below.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="new_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground">New Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="********"
                          type={showPassword ? "text" : "password"}
                          {...field}
                          className="bg-secondary/40 border-border h-11 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2"
                        >
                          {showPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="re_new_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground">Confirm New Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="********"
                          type={showConfirm ? "text" : "password"}
                          {...field}
                          className="bg-secondary/40 border-border h-11 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirm(!showConfirm)}
                          className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2"
                        >
                          {showConfirm ? <IconEyeOff size={18} /> : <IconEye size={18} />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="h-11 w-full font-bold shadow-lg"
              >
                {form.formState.isSubmitting ? (
                  <>
                    <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                    Resetting...
                  </>
                ) : (
                  "Reset Password"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
