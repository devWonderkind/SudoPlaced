"use client";

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginSchema, SignupSchema, ForgotPasswordSchema } from '@/schemas/auth';
import { useAuth } from '@/context/AuthContext';
import { useGoogleLogin } from '@react-oauth/google';
import { toast } from 'sonner';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { IconBrandGoogleFilled, IconEye, IconEyeOff, IconLoader2 } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { requestPasswordReset } from '@/api/auth';

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const { login, signup, googleLogin, user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  const forgotForm = useForm({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: { email: '' },
  });

  // Main auth form — must be declared before any early returns (Rules of Hooks)
  const form = useForm({
    resolver: zodResolver(activeTab === 'login' ? LoginSchema : SignupSchema),
    defaultValues: { email: '', password: '', full_name: '', re_password: '' },
  });

  const handleForgotSubmit = async (values) => {
    try {
      setForgotLoading(true);
      await requestPasswordReset(values.email);
      toast.success('Password reset email sent! Check your inbox.');
      setForgotOpen(false);
      forgotForm.reset();
    } catch (err) {
      toast.error(err.response?.data?.email?.[0] || 'Failed to send reset email.');
    } finally {
      setForgotLoading(false);
    }
  };

  const onSubmit = async (values) => {
    try {
      if (activeTab === 'login') {
        await login(values);
        toast.success('Welcome back to Sudo Placed!');
      } else {
        await signup(values);
        toast.success('Account created! Check your email for activation.');
        setActiveTab('login');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Something went wrong. Please try again.';
      toast.error(errorMsg);
    }
  };

  const handleGoogle = useGoogleLogin({
    onSuccess: (tokenResponse) => googleLogin(tokenResponse.access_token),
    onError: () => toast.error('Google login failed'),
  });

  if (loading || user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <IconLoader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="bg-background relative flex min-h-screen w-full items-center justify-center p-4">
      <Card className="border-border bg-card/60 w-full max-w-md shadow-2xl backdrop-blur-xl">
        <CardHeader className="text-center">
          <CardTitle className="from-foreground to-muted-foreground bg-gradient-to-r bg-clip-text text-3xl font-extrabold text-transparent">
            Sudo Placed
          </CardTitle>
          <CardDescription>
            {activeTab === 'login'
              ? 'Login to track your placement journey'
              : 'Create your account and get placed'}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={(val) => {
              setActiveTab(val);
              form.reset();
            }}
            className="w-full"
          >
            <TabsList className="mb-6 grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Register</TabsTrigger>
            </TabsList>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                {/* Full Name - Signup Only */}
                {activeTab === 'signup' && (
                  <FormField
                    control={form.control}
                    name="full_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-muted-foreground">Full Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Your Name"
                            {...field}
                            className="bg-secondary/40 border-border h-11"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {/* Email - Always */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-muted-foreground">Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="email@example.com"
                          {...field}
                          className="bg-secondary/40 border-border h-11"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password - Always */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel className="text-muted-foreground">Password</FormLabel>
                        {activeTab === 'login' && (
                          <Button
                            type="button"
                            variant="link"
                            className="text-primary h-auto px-0 text-xs"
                            onClick={() => setForgotOpen(true)}
                          >
                            Forgot?
                          </Button>
                        )}
                      </div>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="********"
                            type={showPassword ? 'text' : 'password'}
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

                {/* Confirm Password - Signup Only (CRITICAL: Required by Schema) */}
                {activeTab === 'signup' && (
                  <FormField
                    control={form.control}
                    name="re_password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-muted-foreground">Confirm Password</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Confirm your password"
                            type="password"
                            {...field}
                            className="bg-secondary/40 border-border h-11"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="h-11 w-full font-bold shadow-lg"
                >
                  {form.formState.isSubmitting
                    ? 'Processing...'
                    : activeTab === 'login'
                      ? 'Sign In'
                      : 'Create Account'}
                </Button>

                <div className="relative flex items-center py-2">
                  <div className="border-border flex-grow border-t" />
                  <span className="text-muted-foreground mx-4 text-[10px] font-semibold tracking-widest uppercase">
                    Or
                  </span>
                  <div className="border-border flex-grow border-t" />
                </div>

                <Button
                  variant="outline"
                  type="button"
                  onClick={() => handleGoogle()}
                  className="border-border bg-secondary/20 hover:bg-secondary/40 text-foreground h-11 w-full gap-2"
                >
                  <IconBrandGoogleFilled size={18} />
                  Google
                </Button>
              </form>
            </Form>
          </Tabs>
        </CardContent>
      </Card>

      {/* ── Forgot Password Dialog ── */}
      <Dialog open={forgotOpen} onOpenChange={setForgotOpen}>
        <DialogContent className="border-border bg-card/90 backdrop-blur-xl sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Reset your password</DialogTitle>
            <DialogDescription>
              Enter your email and we&apos;ll send you a reset link.
            </DialogDescription>
          </DialogHeader>

          <Form {...forgotForm}>
            <form onSubmit={forgotForm.handleSubmit(handleForgotSubmit)} className="space-y-4">
              <FormField
                control={forgotForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground">Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="email@example.com"
                        {...field}
                        className="bg-secondary/40 border-border h-11"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={forgotLoading} className="h-11 w-full font-bold">
                {forgotLoading ? (
                  <><IconLoader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...</>
                ) : (
                  'Send Reset Link'
                )}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}