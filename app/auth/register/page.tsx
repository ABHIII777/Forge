"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/Card";
import { Separator } from "@/components/ui/Separator";
import { ExternalLink, Mail, User, Lock } from "lucide-react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [formData, setFormData] = React.useState({
    fullName: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Enter a valid email";
    if (!formData.username.trim()) newErrors.username = "Username is required";
    else if (formData.username.length < 3)
      newErrors.username = "Username must be at least 3 characters";
    else if (!/^[a-zA-Z0-9_-]+$/.test(formData.username))
      newErrors.username = "Username can only contain letters, numbers, underscores, and hyphens";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const data = await fetch("/auth/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/strong"
      },
      body: JSON.stringify({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password
      })
    })

    if (data.ok) {
      console.log("looks like everything is working fine")
    } else {
      console.log("Something went wrong.", data)
    }

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    router.push("/auth/login");
    setIsLoading(false);
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] flex items-center justify-center p-4">
      <div className="w-full max-w-[440px]">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="w-10 h-10 bg-[var(--color-accent-primary)] rounded-[var(--radius-md)] flex items-center justify-center">
              <span className="text-[var(--color-text-inverse)] font-bold font-mono text-lg">
                F
              </span>
            </div>
            <span className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">
              FORGE
            </span>
          </Link>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle>Create your account</CardTitle>
            <CardDescription>Start collaborating with your team in minutes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Button variant="secondary" size="sm" className="w-full" type="button">
                <ExternalLink className="h-4 w-4" />
                <span>GitHub</span>
              </Button>
              <Button variant="secondary" size="sm" className="w-full" type="button">
                <Mail className="h-4 w-4" />
                <span>Google</span>
              </Button>
            </div>
            <div className="relative">
              <Separator />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[var(--color-bg-elevated)] px-2 text-xs text-[var(--color-text-muted)]">
                or continue with email
              </span>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Full Name"
                type="text"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={(e) => handleChange("fullName", e.target.value)}
                error={errors.fullName}
                icon={<User className="h-4 w-4" />}
                required
                autoComplete="name"
              />
              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                error={errors.email}
                icon={<Mail className="h-4 w-4" />}
                required
                autoComplete="email"
              />
              <Input
                label="Username"
                type="text"
                placeholder="johndoe"
                value={formData.username}
                onChange={(e) => handleChange("username", e.target.value)}
                error={errors.username}
                icon={<User className="h-4 w-4" />}
                required
                autoComplete="username"
                hint="Letters, numbers, underscores, and hyphens only"
              />
              <Input
                label="Password"
                type="password"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                error={errors.password}
                icon={<Lock className="h-4 w-4" />}
                required
                autoComplete="new-password"
                hint="At least 8 characters"
              />
              <Input
                label="Confirm Password"
                type="password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={(e) => handleChange("confirmPassword", e.target.value)}
                error={errors.confirmPassword}
                icon={<Lock className="h-4 w-4" />}
                required
                autoComplete="new-password"
              />
              <div className="flex items-start gap-2 text-sm">
                <input
                  type="checkbox"
                  id="terms"
                  required
                  className="mt-1 h-4 w-4 rounded border-[var(--color-border-primary)] bg-[var(--color-bg-secondary)] text-[var(--color-accent-primary)] focus:ring-[var(--color-accent-primary)] focus:ring-offset-[var(--color-bg-primary)]"
                />
                <label htmlFor="terms" className="text-[var(--color-text-secondary)]">
                  I agree to the{" "}
                  <Link
                    href="/terms"
                    className="text-[var(--color-accent-primary)] hover:underline"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="text-[var(--color-accent-primary)] hover:underline"
                  >
                    Privacy Policy
                  </Link>
                </label>
              </div>
              <Button type="submit" className="w-full" loading={isLoading}>
                Create Account
              </Button>
            </form>
          </CardContent>
          <CardFooter className="text-center">
            <p className="text-sm text-[var(--color-text-muted)]">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="text-[var(--color-accent-primary)] hover:underline font-medium"
              >
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

