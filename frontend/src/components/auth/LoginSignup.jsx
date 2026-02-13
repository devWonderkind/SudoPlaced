"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconBrandGoogleFilled, IconEye, IconEyeOff, IconArrowLeft } from '@tabler/icons-react';
import Link from 'next/link';
import Particles from '@/components/reactbits/Particles';
import { Button } from '@/components/ui/button';

export default function LoginSignup() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setShowPassword(false);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-neutral-950 flex items-center justify-center text-white">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <Particles/>
      </div>

      {/* Overlay to ensure text readability */}
      <div className="absolute inset-0 bg-neutral-950/40 z-0 backdrop-blur-[1px]" />

      {/* Return to Home */}
      <Link href="/" className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20 flex items-center gap-2 text-neutral-400 hover:text-white transition-colors">
        <IconArrowLeft size={20} />
        <span className="text-sm font-medium">Back to Home</span>
      </Link>

      {/* Card Container */}
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-[90%] sm:w-full max-w-md p-6 sm:p-8 bg-neutral-900/60 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
      >
        {/* Glow Effects */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.h2
              key={isLogin ? "login-title" : "signup-title"}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-400"
            >
              {isLogin ? "Welcome Back" : "Create Account"}
            </motion.h2>
            <motion.p
              key={isLogin ? "login-sub" : "signup-sub"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-neutral-400 text-sm mt-2"
            >
              {isLogin ? "Enter your details to sign in" : "Join us and start your journey"}
            </motion.p>
          </div>

          {/* Form */}
          <div className="space-y-4">
             {/* Name Field (Signup only) */}
             <AnimatePresence mode="popLayout">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <label className="block text-xs font-medium text-neutral-400 mb-1.5 ml-1">Full Name</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="w-full bg-neutral-800/50 border border-white/10 rounded-xl px-3 py-2.5 sm:px-4 sm:py-3 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email Field */}
            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1.5 ml-1">Email</label>
              <input
                type="email"
                placeholder="name@example.com"
                className="w-full bg-neutral-800/50 border border-white/10 rounded-xl px-3 py-2.5 sm:px-4 sm:py-3 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1.5 ml-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full bg-neutral-800/50 border border-white/10 rounded-xl px-3 py-2.5 sm:px-4 sm:py-3 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 transition-colors"
                >
                  {showPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <Button className="w-full">
              {isLogin ? "Sign In" : "Sign Up"}
            </Button>

            {/* Divider */}
            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-white/10"></div>
              <span className="flex-shrink-0 mx-4 text-neutral-500 text-xs">Or continue with</span>
              <div className="flex-grow border-t border-white/10"></div>
            </div>

            {/* Google Button */}
            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-200 font-medium py-3 rounded-xl transition-all cursor-pointer"
            >
                
              <IconBrandGoogleFilled size={20} />
              <span>Google</span>
            </button>
          </div>

          {/* Toggle Login/Signup */}
          <div className="mt-8 text-center">
            <p className="text-neutral-500 text-sm">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                onClick={toggleForm}
                className="ml-1.5 text-blue-400 hover:text-blue-300 font-medium transition-colors cursor-pointer"
              >
                {isLogin ? "Sign up" : "Log in"}
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
