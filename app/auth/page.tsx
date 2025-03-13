"use client";

import { useState } from "react";
import { SignInForm } from "@/components/auth/SignInForm";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AuthPage() {
  const [isSignIn, setIsSignIn] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">
      <Card className="w-full max-w-md p-8 rounded-2xl shadow-2xl bg-white">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
            {isSignIn ? "Welcome Back" : "Create an Account"}
          </CardTitle>
          <p className="text-gray-500">
            {isSignIn ? "Sign in to continue to Gourmet Delights" : "Join us and explore delicious recipes"}
          </p>
        </CardHeader>
        <CardContent>
          {isSignIn ? <SignInForm /> : <SignUpForm />}
          <div className="mt-6 text-center">
            <Button variant="link" onClick={() => setIsSignIn(!isSignIn)} className="text-indigo-600 hover:text-indigo-500">
              {isSignIn ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}