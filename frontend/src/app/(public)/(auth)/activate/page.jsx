"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { activateUser } from '@/api/auth'; 
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IconLoader2, IconCircleCheck, IconCircleX, IconArrowRight } from '@tabler/icons-react';

function ActivationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const uid = searchParams.get('uid');
  const token = searchParams.get('token');
  const [status, setStatus] = useState('loading'); 

  useEffect(() => {
    const triggerActivation = async () => {
      try {
        if (!uid || !token) {
           setStatus('error');
           toast.error("Invalid activation link.");
           return;
        }

        // Just call activate; removed artificial delay for UX unless really needed, 
        // kept minimal logic to match original intent
        await activateUser(uid, token);
        
        setStatus('success');
        toast.success("Account activated! Welcome to Sudo Placed.");
      } catch (err) {
        setStatus('error');
        const errorDetail = err.response?.data?.detail || "Invalid or expired link.";
        toast.error(errorDetail);
      }
    };

    triggerActivation();
  }, [uid, token]);

  return (
    <Card className="w-full max-w-md border-border bg-card/60 backdrop-blur-xl text-center shadow-2xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-foreground to-muted-foreground">
            Activation
          </CardTitle>
          <CardDescription>Finalizing your Sudo Placed account</CardDescription>
        </CardHeader>
        
        <CardContent className="flex flex-col items-center gap-6 py-10">
          
          {status === 'loading' && (
            <div className="space-y-4">
              <IconLoader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
              <p className="text-muted-foreground animate-pulse">Verifying credentials...</p>
            </div>
          )}

          {status === 'success' && (
            <div className="space-y-6 w-full">
              <div className="bg-primary/10 p-4 rounded-full w-fit mx-auto">
                <IconCircleCheck className="h-12 w-12 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-foreground">Email Verified</h3>
                <p className="text-muted-foreground text-sm px-4">
                  Your account is now fully active. You&apos;re ready to start tracking your placement journey.
                </p>
              </div>
              {/* Manual Redirect Button */}
              <Button 
                onClick={() => router.push('/login')} 
                className="w-full h-12 rounded-xl font-bold gap-2 group"
              >
                Continue to Login
                <IconArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-6 w-full">
              <div className="bg-destructive/10 p-4 rounded-full w-fit mx-auto">
                <IconCircleX className="h-12 w-12 text-destructive" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-foreground">Link Expired</h3>
                <p className="text-muted-foreground text-sm px-4">
                  This activation link is no longer valid. Please try signing up again or contact support.
                </p>
              </div>
              <Button 
                onClick={() => router.push('/login')} 
                variant="outline" 
                className="w-full h-12 rounded-xl border-border hover:bg-secondary/50"
              >
                Back to Login
              </Button>
            </div>
          )}

        </CardContent>
      </Card>
  );
}

export default function ActivationPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Suspense fallback={<div className="text-center">Loading...</div>}>
         <ActivationContent />
      </Suspense>
    </div>
  );
}
