"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import {
  GitBranch,
  CheckSquare,
  Users,
  MessageSquare,
  FileText,
  ArrowRight,
  Sparkles,
  Shield,
  Zap,
  Code,
  Globe,
  Star,
  Code2,
} from "lucide-react";

const features = [
  {
    icon: GitBranch,
    title: "Workspaces & Projects",
    description: "Organize work across multiple workspaces with customizable projects, each with their own issue workflows and team settings.",
  },
  {
    icon: CheckSquare,
    title: "Issue Tracking",
    description: "Full-featured issue management with statuses, priorities, labels, assignees, due dates, and powerful filtering.",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Role-based access control, online presence indicators, activity feeds, and real-time updates across your team.",
  },
  {
    icon: MessageSquare,
    title: "Discussions",
    description: "Threaded discussions with categories, replies, pins, locks, and rich text support for technical decisions.",
  },
  {
    icon: FileText,
    title: "File Management",
    description: "Hierarchical file browser with versioning, mime-type detection, size tracking, and drag-and-drop uploads.",
  },
  {
    icon: Sparkles,
    title: "Global Search",
    description: "Instant search across projects, issues, discussions, files, and users with keyboard shortcuts and filters.",
  },
];

const stats = [
  { value: "10k+", label: "Active Developers" },
  { value: "50k+", label: "Issues Resolved" },
  { value: "5k+", label: "Projects Created" },
  { value: "99.9%", label: "Uptime SLA" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
      {/* Navigation */}
      <header className="border-b-2 border-[var(--color-border-primary)] sticky top-0 z-50 bg-[var(--color-bg-primary)]/95 backdrop-blur-sm">
        <nav className="max-w-[1400px] mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="w-10 h-10 bg-[var(--color-accent-primary)] rounded-[var(--radius-md)] flex items-center justify-center">
              <span className="text-[var(--color-text-inverse)] font-bold font-mono text-lg">F</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-[var(--color-text-primary)]">FORGE</span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-fast">Features</Link>
            <Link href="#stats" className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-fast">Stats</Link>
            <Link href="/docs" className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-fast">Docs</Link>
            <Link href="/changelog" className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-fast">Changelog</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth/login">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link href="/auth/register">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="relative">
        <section className="max-w-[1400px] mx-auto px-6 py-20 md:py-32">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-accent-primary-muted)] border-2 border-[var(--color-accent-primary)]/30 text-[var(--color-accent-primary)] text-xs font-medium font-mono mb-6 animate-fade-in">
              <Star className="h-3 w-3" />
              <span>v2.0 released — Faster, lighter, better</span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-[var(--color-text-primary)] mb-6 animate-slide-in text-balance">
              Build software <span className="text-[var(--color-accent-primary)]">together</span>, not alone
            </h1>
            <p className="text-lg md:text-xl text-[var(--color-text-secondary)] mb-10 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: "100ms" }}>
              Forge is the collaborative developer platform that brings your team&apos;s workflow into one place. Plan, track, discuss, and ship — all without context switching.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: "200ms" }}>
              <Link href="/auth/register">
                <Button size="lg" className="w-full sm:w-auto gap-2">
                  Start Free
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/demo">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Watch Demo
                </Button>
              </Link>
            </div>
            <p className="mt-6 text-sm text-[var(--color-text-muted)] animate-fade-in" style={{ animationDelay: "300ms" }}>
              No credit card required · 14-day free trial · Cancel anytime
            </p>
          </div>

          {/* Hero Visual */}
          <div className="mt-16 relative animate-fade-in" style={{ animationDelay: "400ms" }}>
            <div className="card-base border-hard-lg overflow-hidden max-w-5xl mx-auto">
              <div className="bg-[var(--color-bg-secondary)] border-b-2 border-[var(--color-border-primary)] px-4 py-3 flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[var(--color-status-error)]" />
                  <div className="w-3 h-3 rounded-full bg-[var(--color-status-warning)]" />
                  <div className="w-3 h-3 rounded-full bg-[var(--color-status-success)]" />
                </div>
                <div className="flex-1 text-center text-xs text-[var(--color-text-muted)] font-mono">dashboard.forge.dev</div>
              </div>
              <div className="p-6 bg-[var(--color-bg-primary)] grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="card-base p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <GitBranch className="h-5 w-5 text-[var(--color-accent-primary)]" />
                    <span className="font-medium text-[var(--color-text-primary)]">forge-cli</span>
                    <span className="badge-primary ml-auto">active</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
                      <CheckSquare className="h-4 w-4 text-[var(--color-status-success)]" />
                      <span>Issue #234 merged</span>
                    </div>
                    <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
                      <GitBranch className="h-4 w-4 text-[var(--color-accent-secondary)]" />
                      <span>New branch: feat/api-v2</span>
                    </div>
                    <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
                      <MessageSquare className="h-4 w-4 text-[var(--color-status-info)]" />
                      <span>Discussion: RFC #12</span>
                    </div>
                  </div>
                </div>
                <div className="card-base p-4 lg:col-span-2">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-medium text-[var(--color-text-primary)]">Sprint 24 — In Progress</span>
                    <span className="text-xs font-mono text-[var(--color-text-muted)]">67% complete</span>
                  </div>
                  <div className="h-2 bg-[var(--color-bg-tertiary)] rounded-full overflow-hidden mb-4">
                    <div className="h-full bg-[var(--color-accent-primary)] rounded-full" style={{ width: "67%" }} />
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="p-3 bg-[var(--color-bg-secondary)] rounded-[var(--radius-md)]">
                      <div className="text-2xl font-bold font-mono text-[var(--color-accent-primary)]">23</div>
                      <div className="text-xs text-[var(--color-text-muted)]">To Do</div>
                    </div>
                    <div className="p-3 bg-[var(--color-bg-secondary)] rounded-[var(--radius-md)]">
                      <div className="text-2xl font-bold font-mono text-[var(--color-status-warning)]">12</div>
                      <div className="text-xs text-[var(--color-text-muted)]">In Progress</div>
                    </div>
                    <div className="p-3 bg-[var(--color-bg-secondary)] rounded-[var(--radius-md)]">
                      <div className="text-2xl font-bold font-mono text-[var(--color-status-success)]">47</div>
                      <div className="text-xs text-[var(--color-text-muted)]">Done</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trusted By */}
        <section className="border-y-2 border-[var(--color-border-primary)] py-12">
          <div className="max-w-[1400px] mx-auto px-6">
            <p className="text-center text-xs font-mono text-[var(--color-text-muted)] tracking-widest uppercase mb-8">Trusted by innovative teams worldwide</p>
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-40 hover:opacity-100 transition-base">
              <span className="font-mono text-[var(--color-text-muted)]">Vercel</span>
              <span className="font-mono text-[var(--color-text-muted)]">Linear</span>
              <span className="font-mono text-[var(--color-text-muted)]">Railway</span>
              <span className="font-mono text-[var(--color-text-muted)]">Supabase</span>
              <span className="font-mono text-[var(--color-text-muted)]">Trigger.dev</span>
              <span className="font-mono text-[var(--color-text-muted)]">Turborepo</span>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-20 md:py-32">
          <div className="max-w-[1400px] mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text-primary)] mb-4">Everything you need to ship faster</h2>
              <p className="text-[var(--color-text-secondary)] text-lg">Powerful features designed for modern development workflows</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <article
                  key={feature.title}
                  className="card-hover p-6 group"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-12 h-12 rounded-[var(--radius-md)] bg-[var(--color-accent-primary-muted)] border-2 border-[var(--color-accent-primary)]/30 flex items-center justify-center mb-4 group-hover:border-[var(--color-accent-primary)] group-hover:bg-[var(--color-accent-primary-muted)] transition-base">
                    <feature.icon className="h-6 w-6 text-[var(--color-accent-primary)]" />
                  </div>
                  <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">{feature.title}</h3>
                  <p className="text-[var(--color-text-secondary)] leading-relaxed">{feature.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section id="stats" className="bg-[var(--color-bg-secondary)] border-y-2 border-[var(--color-border-primary)] py-20">
          <div className="max-w-[1400px] mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={stat.label} className="text-center" style={{ animationDelay: `${index * 100}ms` }}>
                  <div className="text-4xl md:text-5xl font-bold font-mono text-[var(--color-accent-primary)] mb-2">{stat.value}</div>
                  <div className="text-[var(--color-text-secondary)] font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 md:py-32">
          <div className="max-w-[1400px] mx-auto px-6">
            <div className="card-base border-hard-lg p-8 md:p-12 text-center max-w-3xl mx-auto relative overflow-hidden">
              <div className="absolute inset-0 bg-grid opacity-50" />
              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text-primary)] mb-4">Ready to forge better software?</h2>
                <p className="text-[var(--color-text-secondary)] text-lg mb-8">Join thousands of developers who&apos;ve switched to Forge. Free for small teams, no credit card required.</p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link href="/auth/register">
                    <Button size="lg" className="w-full sm:w-auto gap-2">
                      Create Free Account
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/auth/login">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto">
                      Sign In
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t-2 border-[var(--color-border-primary)] py-12 bg-[var(--color-bg-secondary)]">
          <div className="max-w-[1400px] mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
              <div className="md:col-span-2">
                <Link href="/" className="inline-flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-[var(--color-accent-primary)] rounded-[var(--radius-md)] flex items-center justify-center">
                    <span className="text-[var(--color-text-inverse)] font-bold font-mono text-lg">F</span>
                  </div>
                  <span className="text-xl font-bold tracking-tight text-[var(--color-text-primary)]">FORGE</span>
                </Link>
                <p className="text-[var(--color-text-secondary)] max-w-xs">The collaborative developer platform for modern teams.</p>
                <div className="flex items-center gap-4 mt-6">
                  <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-[var(--color-text-muted)] hover:text-[var(--color-accent-primary)] transition-fast">
                    <Code2 className="h-5 w-5" />
                  </a>
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-[var(--color-text-muted)] hover:text-[var(--color-accent-primary)] transition-fast">
                    <Globe className="h-5 w-5" />
                  </a>
                  <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="text-[var(--color-text-muted)] hover:text-[var(--color-accent-primary)] transition-fast">
                    <MessageSquare className="h-5 w-5" />
                  </a>
                </div>
              </div>
              <nav>
                <h4 className="font-semibold text-[var(--color-text-primary)] mb-4">Product</h4>
                <ul className="space-y-2 text-sm">
                  <li><Link href="#features" className="text-[var(--color-text-secondary)] hover:text-[var(--color-accent-primary)] transition-fast">Features</Link></li>
                  <li><Link href="/pricing" className="text-[var(--color-text-secondary)] hover:text-[var(--color-accent-primary)] transition-fast">Pricing</Link></li>
                  <li><Link href="/changelog" className="text-[var(--color-text-secondary)] hover:text-[var(--color-accent-primary)] transition-fast">Changelog</Link></li>
                  <li><Link href="/roadmap" className="text-[var(--color-text-secondary)] hover:text-[var(--color-accent-primary)] transition-fast">Roadmap</Link></li>
                  <li><Link href="/integrations" className="text-[var(--color-text-secondary)] hover:text-[var(--color-accent-primary)] transition-fast">Integrations</Link></li>
                </ul>
              </nav>
              <nav>
                <h4 className="font-semibold text-[var(--color-text-primary)] mb-4">Resources</h4>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/docs" className="text-[var(--color-text-secondary)] hover:text-[var(--color-accent-primary)] transition-fast">Documentation</Link></li>
                  <li><Link href="/api" className="text-[var(--color-text-secondary)] hover:text-[var(--color-accent-primary)] transition-fast">API Reference</Link></li>
                  <li><Link href="/community" className="text-[var(--color-text-secondary)] hover:text-[var(--color-accent-primary)] transition-fast">Community</Link></li>
                  <li><Link href="/blog" className="text-[var(--color-text-secondary)] hover:text-[var(--color-accent-primary)] transition-fast">Blog</Link></li>
                  <li><Link href="/status" className="text-[var(--color-text-secondary)] hover:text-[var(--color-accent-primary)] transition-fast">Status</Link></li>
                </ul>
              </nav>
              <nav>
                <h4 className="font-semibold text-[var(--color-text-primary)] mb-4">Company</h4>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/about" className="text-[var(--color-text-secondary)] hover:text-[var(--color-accent-primary)] transition-fast">About</Link></li>
                  <li><Link href="/careers" className="text-[var(--color-text-secondary)] hover:text-[var(--color-accent-primary)] transition-fast">Careers</Link></li>
                  <li><Link href="/press" className="text-[var(--color-text-secondary)] hover:text-[var(--color-accent-primary)] transition-fast">Press</Link></li>
                  <li><Link href="/contact" className="text-[var(--color-text-secondary)] hover:text-[var(--color-accent-primary)] transition-fast">Contact</Link></li>
                  <li><Link href="/privacy" className="text-[var(--color-text-secondary)] hover:text-[var(--color-accent-primary)] transition-fast">Privacy</Link></li>
                </ul>
              </nav>
            </div>
            <div className="border-t-2 border-[var(--color-border-primary)] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-sm text-[var(--color-text-muted)]">© {new Date().getFullYear()} Forge. All rights reserved.</p>
              <div className="flex items-center gap-6 text-sm text-[var(--color-text-muted)]">
                <Link href="/terms" className="hover:text-[var(--color-accent-primary)] transition-fast">Terms</Link>
                <Link href="/privacy" className="hover:text-[var(--color-accent-primary)] transition-fast">Privacy</Link>
                <Link href="/cookies" className="hover:text-[var(--color-accent-primary)] transition-fast">Cookies</Link>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}