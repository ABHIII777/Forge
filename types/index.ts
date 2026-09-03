export type Priority = "critical" | "high" | "medium" | "low";
export type IssueStatus = "backlog" | "in_progress" | "review" | "done";
export type ProjectStatus = "planning" | "active" | "on_hold" | "completed" | "archived";
export type UserRole = "owner" | "admin" | "member" | "viewer";
export type NotificationType =
  | "mention"
  | "assignment"
  | "comment"
  | "workspace_invite"
  | "project_activity"
  | "system";
export type DiscussionCategory = "general" | "technical" | "proposal" | "announcement" | "question";

export interface User {
  id: string;
  username: string;
  displayName: string;
  email: string;
  avatarUrl: string | null;
  bio: string | null;
  role: UserRole;
  createdAt: Date;
  lastActiveAt: Date | null;
  isOnline: boolean;
}

export interface Workspace {
  id: string;
  name: string;
  description: string;
  slug: string;
  ownerId: string;
  memberCount: number;
  projectCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkspaceMember {
  user: User;
  role: UserRole;
  joinedAt: Date;
}

export interface Project {
  id: string;
  workspaceId: string;
  name: string;
  description: string;
  key: string;
  status: ProjectStatus;
  progress: number;
  memberCount: number;
  issueCount: number;
  openIssueCount: number;
  createdAt: Date;
  updatedAt: Date;
  ownerId: string;
}

export interface ProjectMember {
  user: User;
  role: UserRole;
  joinedAt: Date;
}

export interface Issue {
  id: string;
  projectId: string;
  number: number;
  title: string;
  description: string;
  status: IssueStatus;
  priority: Priority;
  assigneeId: string | null;
  reporterId: string;
  labels: Label[];
  commentsCount: number;
  attachmentsCount: number;
  dueDate: Date | null;
  startedAt: Date | null;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Label {
  id: string;
  projectId: string;
  name: string;
  color: string;
  description: string | null;
}

export interface Comment {
  id: string;
  issueId: string | null;
  discussionId: string | null;
  authorId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  isEdited: boolean;
}

export interface Discussion {
  id: string;
  projectId: string | null;
  workspaceId: string;
  category: DiscussionCategory;
  title: string;
  content: string;
  authorId: string;
  repliesCount: number;
  viewsCount: number;
  isPinned: boolean;
  isLocked: boolean;
  lastActivityAt: Date;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
}

export interface DiscussionReply {
  id: string;
  discussionId: string;
  authorId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  isEdited: boolean;
}

export interface FileItem {
  id: string;
  projectId: string | null;
  workspaceId: string;
  name: string;
  path: string;
  type: "file" | "folder";
  mimeType: string | null;
  size: number;
  uploadedById: string;
  version: number;
  parentId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  actionUrl: string | null;
  metadata: Record<string, unknown>;
  isRead: boolean;
  createdAt: Date;
}

export interface ActivityEvent {
  id: string;
  workspaceId: string;
  projectId: string | null;
  userId: string;
  type: string;
  description: string;
  metadata: Record<string, unknown>;
  createdAt: Date;
}

export interface SearchResult {
  id: string;
  type: "project" | "issue" | "discussion" | "file" | "user";
  title: string;
  subtitle: string;
  url: string;
  metadata: Record<string, unknown>;
}

export interface InviteData {
  email: string;
  role: UserRole;
  workspaceId: string;
  projectId?: string;
}

export interface CreateProjectData {
  name: string;
  description: string;
  key: string;
  workspaceId: string;
}

export interface CreateIssueData {
  title: string;
  description: string;
  projectId: string;
  priority: Priority;
  assigneeId?: string;
  labels?: string[];
  dueDate?: Date;
}

export interface CreateDiscussionData {
  title: string;
  content: string;
  workspaceId: string;
  projectId?: string;
  category: DiscussionCategory;
  tags?: string[];
}

export interface UpdateProfileData {
  displayName: string;
  bio: string;
  avatarUrl?: string;
}

export interface SettingsData {
  profile: UpdateProfileData;
  account: {
    email: string;
    username: string;
  };
  appearance: {
    theme: "dark" | "light" | "system";
    density: "compact" | "comfortable" | "spacious";
    sidebarCollapsed: boolean;
  };
  notifications: {
    email: boolean;
    push: boolean;
    mentions: boolean;
    assignments: boolean;
    comments: boolean;
    workspaceActivity: boolean;
  };
  security: {
    password: string;
    newPassword: string;
    confirmPassword: string;
    sessions: SessionData[];
  };
}

export interface SessionData {
  id: string;
  device: string;
  browser: string;
  os: string;
  location: string;
  lastActive: Date;
  isCurrent: boolean;
}