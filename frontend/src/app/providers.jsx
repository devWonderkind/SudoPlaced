'use client';
import { ThemeProvider } from 'next-themes';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from '@/context/AuthContext';
import { TooltipProvider } from '@/components/ui/tooltip';

export function Providers({ children }) {
  return (
    <ThemeProvider attribute={'class'} defaultTheme="dark" enableSystem>
      <TooltipProvider>
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
          <AuthProvider>{children}</AuthProvider>
        </GoogleOAuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  );
}
