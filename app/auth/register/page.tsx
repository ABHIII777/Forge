"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card";
import { Separator } from "@/components/ui/Separator";
import { ExternalLink, Mail } from "lucide-react";

export default function RegisterPage() {
  const [formData, setFormData] = React.useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
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
            <CardTitle>Create account</CardTitle>
            <CardDescription>Start collaborating with your team</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Button variant="secondary" size="sm" className="w-full"><ExternalLink className="h-4 w-4" /> GitHub</Button>
              <Button variant="secondary" size="sm" className="w-full"><Mail className="h-4 w-4" /> Google</Button>
            </div>
            <div className="relative">
              <Separator />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[var(--color-bg-elevated)] px-2 text-xs text-[var(--color-text-muted)]">or</span>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="Full Name" placeholder="Your name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
              <Input label="Email" type="email" placeholder="you@example.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
              <Input label="Password" type="password" placeholder="Create a password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
              <Input label="Confirm Password" type="password" placeholder="Confirm your password" value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} required />
              <Button type="submit" className="w-full" loading={isLoading}>Create Account</Button>
            </form>
          </CardContent>
          <CardFooter className="text-center">
            <p className="text-sm text-[var(--color-text-muted)]">
              Already have an account? <Link href="/auth/login" className="text-[var(--color-accent-primary)] hover:underline">Sign in</Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}