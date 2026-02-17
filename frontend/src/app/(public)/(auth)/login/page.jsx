"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginSchema, SignupSchema } from '@/schemas/auth';
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
import { IconBrandGoogleFilled, IconEye, IconEyeOff } from '@tabler/icons-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { useRouter } from 'next/router';

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const { login, signup, googleLogin } = useAuth();

  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  if (loading || user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <IconLoader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  // Initialize form with dynamic resolver based on active tab
  const form = useForm({
    resolver: zodResolver(activeTab === 'login' ? LoginSchema : SignupSchema),
    defaultValues: { email: '', password: '', full_name: '', re_password: '' },
  });

  const onSubmit = async (values) => {
    try {
      if (activeTab === 'login') {
        await login(values);
        toast.success('Welcome back to Sudo Placed!');
      } else {
        await signup(values);
        toast.success('Account created! Check your email for activation.');
        setActiveTab('login'); // Move user to login after successful signup
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

  return (
    <div className="bg-background relative flex min-h-screen w-full items-center justify-center p-4">
      {/* Theme Toggle - Always visible */}
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

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
                          <Button variant="link" className="text-primary h-auto px-0 text-xs">
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
    </div>
  );
}