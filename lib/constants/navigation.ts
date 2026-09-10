import {
  LayoutDashboard,
  FolderKanban,
  AlertCircle,
  MessageSquare,
  Activity,
  Settings,
  Columns3,
  Users,
} from "lucide-react";

export const projectNav = [
  { label: "Overview", href: "", icon: LayoutDashboard },
  { label: "Board", href: "/board", icon: Columns3 },
  { label: "Issues", href: "/issues", icon: AlertCircle },
  { label: "Discussions", href: "/discussions", icon: MessageSquare },
  { label: "Activity", href: "/activity", icon: Activity },
  { label: "Settings", href: "/settings", icon: Settings },
];

export const workspaceNav = [
  { label: "Overview", href: "", icon: Activity },
  { label: "Projects", href: "/projects", icon: FolderKanban },
  { label: "Issues", href: "/issues", icon: AlertCircle },
  { label: "Discussions", href: "/discussions", icon: MessageSquare },
  { label: "Team", href: "/team", icon: Users },
  { label: "Activity", href: "/activity", icon: Activity },
  { label: "Settings", href: "/settings", icon: Settings },
];
