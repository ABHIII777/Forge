"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card";
import { Separator } from "@/components/ui/Separator";
import { ExternalLink, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { AuthLayout } from "@/components/layout/AuthLayout";

export default function LoginPage() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const data = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password
      })
    })

    if (data.ok) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.push("/dashboard");
      setIsLoading(false);
    } else {
      alert(data)
      setIsLoading(false)
    }

  };

  return (
    <AuthLayout>
      <Card>
        <CardHeader className="text-center">
          <CardTitle>Welcome back</CardTitle>
          <CardDescription>Sign in to your account</CardDescription>
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
            <Input label="Email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Input label="Password" type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-[var(--color-text-secondary)]">
                <input type="checkbox" className="rounded border-[var(--color-border-primary)]" /> Remember me
              </label>
              <Link href="/auth/forgot-password" className="text-[var(--color-accent-primary)] hover:underline">Forgot password?</Link>
            </div>
            <Button type="submit" className="w-full" loading={isLoading}>Sign In</Button>
          </form>
        </CardContent>
        <CardFooter className="text-center">
          <p className="text-sm text-[var(--color-text-muted)]">
            Don&apos;t have an account? <Link href="/auth/register" className="text-[var(--color-accent-primary)] hover:underline">Sign up</Link>
          </p>
        </CardFooter>
      </Card>
    </AuthLayout>
  );
}
