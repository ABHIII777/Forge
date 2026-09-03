"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card";
import { ArrowLeft, Mail } from "lucide-react";
import { AuthLayout } from "@/components/layout/AuthLayout";

export default function ForgotPasswordPage() {
  const [email, setEmail] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    setIsSubmitted(true);
  };

  return (
    <AuthLayout>
      <Card>
        <CardHeader className="text-center">
          <CardTitle>Reset password</CardTitle>
          <CardDescription>Enter your email to receive a reset link</CardDescription>
        </CardHeader>
        <CardContent>
          {isSubmitted ? (
            <div className="text-center py-4">
              <Mail className="h-12 w-12 text-[var(--color-accent-primary)] mx-auto mb-4" />
              <p className="text-sm text-[var(--color-text-secondary)]">Check your email for a password reset link.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="Email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <Button type="submit" className="w-full" loading={isLoading}>Send Reset Link</Button>
            </form>
          )}
        </CardContent>
        <CardFooter className="text-center">
          <Link href="/auth/login" className="text-sm text-[var(--color-accent-primary)] hover:underline flex items-center gap-1 mx-auto">
            <ArrowLeft className="h-4 w-4" /> Back to sign in
          </Link>
        </CardFooter>
      </Card>
    </AuthLayout>
  );
}