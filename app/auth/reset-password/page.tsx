"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card";
import { ArrowLeft, CheckCircle } from "lucide-react";

export default function ResetPasswordPage() {
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    setIsSuccess(true);
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] flex items-center justify-center p-4">
      <div className="w-full max-w-[400px]">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="w-10 h-10 bg-[var(--color-accent-primary)] rounded-[var(--radius-md)] flex items-center justify-center">
              <span className="text-[var(--color-text-inverse)] font-bold font-mono text-lg">F</span>
            </div>
            <span className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">FORGE</span>
          </Link>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle>Reset password</CardTitle>
            <CardDescription>Enter your new password</CardDescription>
          </CardHeader>
          <CardContent>
            {isSuccess ? (
              <div className="text-center py-4">
                <CheckCircle className="h-12 w-12 text-[var(--color-status-success)] mx-auto mb-4" />
                <p className="text-sm text-[var(--color-text-secondary)]">Password reset successfully!</p>
                <Link href="/auth/login"><Button variant="primary" className="mt-4">Continue to Sign In</Button></Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input label="New Password" type="password" placeholder="Enter new password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <Input label="Confirm Password" type="password" placeholder="Confirm new password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                <Button type="submit" className="w-full" loading={isLoading}>Reset Password</Button>
              </form>
            )}
          </CardContent>
          <CardFooter className="text-center">
            <Link href="/auth/login" className="text-sm text-[var(--color-accent-primary)] hover:underline flex items-center gap-1 mx-auto">
              <ArrowLeft className="h-4 w-4" /> Back to sign in
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}