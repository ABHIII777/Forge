import type { Issue, IssueStatus, Priority, Project, User } from "@/types";

export interface DashboardStats {
    activeProjects: number;
    openIssues: number;
    assignedToMe: number;
    teamOnline: number;
    pendingReviews: number;
}

export interface DashboardWorkspace {
    id: string;
    name: string;
    slug: string;
}

export interface AssignedIssue {
    id: string;
    number: number;
    title: string;
    status: IssueStatus;
    priority: Priority;
    projectId: string;
    reporterId: string;
    updatedAt: string;
    projectKey: string;
    projectName: string;
    workspaceId: string;
}

export interface DashboardData {
    user: User;
    stats: DashboardStats;
    workspaces: DashboardWorkspace[];
    recentProjects: (Project & { issueCount: number })[];
    assignedIssues: AssignedIssue[];
    onlineUsers: Pick<User, "id" | "displayName" | "username" | "avatarUrl" | "role" | "isOnline">[];
}

export function toIssue(row: AssignedIssue): Issue {
    return {
        id: row.id,
        projectId: row.projectId,
        number: row.number,
        title: row.title,
        description: "",
        status: row.status,
        priority: row.priority,
        assigneeId: null,
        reporterId: row.reporterId,
        labels: [],
        commentsCount: 0,
        attachmentsCount: 0,
        dueDate: null,
        startedAt: null,
        completedAt: null,
        createdAt: new Date(row.updatedAt),
        updatedAt: new Date(row.updatedAt),
    };
}

export async function fetchDashboard(): Promise<DashboardData> {
    const res = await fetch("/api/dashboard");
    const body = await res.json().catch(() => null);
    if (!res.ok) {
        throw new Error(
            typeof body?.error === "string" ? body.error : "Failed to load dashboard",
        );
    }
    return body as DashboardData;
}
