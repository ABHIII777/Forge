"use client";

import * as React from "react";
import Link from "next/link";
import { Search, Bell, Command, Moon, Sun, LogOut, User, Settings, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
} from "@/components/ui/DropdownMenu";
import { mockUsers } from "@/mock-data";

interface HeaderProps {
  onSearchOpen: () => void;
}

export function Header({ onSearchOpen }: HeaderProps) {
  const currentUser = mockUsers[0];
  const unreadCount = 3;

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b-2 border-[var(--color-border-primary)] bg-[var(--color-bg-secondary)] px-4">
      {/* Left: Search Trigger */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={onSearchOpen}
          className="gap-2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
          aria-label="Open search (⌘K)"
        >
          <Search className="h-4 w-4" />
          <span className="hidden sm:inline">Search</span>
          <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded-[var(--radius-sm)] border-2 border-[var(--color-border-primary)] bg-[var(--color-bg-tertiary)] px-1.5 font-mono text-[10px] font-medium text-[var(--color-text-muted)]">
            <Command className="h-3 w-3" />K
          </kbd>
        </Button>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <Link href="/notifications" className="relative">
          <Button variant="ghost" size="sm" aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}>
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-[var(--color-status-error)] text-[10px] font-bold text-white flex items-center justify-center font-mono">
                {unreadCount}
              </span>
            )}
          </Button>
        </Link>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2" aria-label="User menu">
              <Avatar name={currentUser.displayName} size="xs" />
              <span className="hidden sm:inline text-sm">{currentUser.displayName}</span>
              <ChevronDown className="h-3 w-3 text-[var(--color-text-muted)]" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium text-[var(--color-text-primary)]">{currentUser.displayName}</p>
                <p className="text-xs text-[var(--color-text-muted)] font-mono">@{currentUser.username}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profile">
                <User className="mr-2 h-4 w-4" />
                Profile
                <DropdownMenuShortcut>⌘P</DropdownMenuShortcut>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings">
                <Settings className="mr-2 h-4 w-4" />
                Settings
                <DropdownMenuShortcut>⌘,</DropdownMenuShortcut>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut className="mr-2 h-4 w-4" />
              Log out
              <DropdownMenuShortcut>⌘Q</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}