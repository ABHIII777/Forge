"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card";
import { ArrowLeft, CheckCircle } from "lucide-react";

export default function VerifyEmailPage() {
  const [code, setCode] = React.useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isVerified, setIsVerified] = React.useState(false);
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    setIsVerified(true);
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
            <CardTitle>Verify email</CardTitle>
            <CardDescription>Enter the 6-digit code sent to your email</CardDescription>
          </CardHeader>
          <CardContent>
            {isVerified ? (
              <div className="text-center py-4">
                <CheckCircle className="h-12 w-12 text-[var(--color-status-success)] mx-auto mb-4" />
                <p className="text-sm text-[var(--color-text-secondary)]">Email verified successfully!</p>
                <Link href="/auth/login"><Button variant="primary" className="mt-4">Continue to Sign In</Button></Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex gap-2 justify-center">
                  {code.map((digit, index) => (
                    <input key={index} ref={(el) => { inputRefs.current[index] = el; }} type="text" inputMode="numeric" maxLength={1} value={digit} onChange={(e) => handleChange(index, e.target.value)} onKeyDown={(e) => handleKeyDown(index, e)} className="w-12 h-12 text-center text-lg font-mono bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] border-2 border-[var(--color-border-primary)] rounded-[var(--radius-md)] focus:border-[var(--color-border-focus)] focus:outline-none" />
                  ))}
                </div>
                <Button type="submit" className="w-full" loading={isLoading}>Verify</Button>
              </form>
            )}
          </CardContent>
          <CardFooter className="text-center">
            <p className="text-sm text-[var(--color-text-muted)]">
              Didn&apos;t receive a code? <button className="text-[var(--color-accent-primary)] hover:underline">Resend</button>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}