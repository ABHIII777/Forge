import {
  pgTable,
  pgEnum,
  uuid,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
  primaryKey,
} from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", [
  "owner",
  "admin",
  "member",
  "viewer",
]);

export const projectStatusEnum = pgEnum("project_status", [
  "planning",
  "active",
  "on_hold",
  "completed",
  "archived",
]);

export const issueStatusEnum = pgEnum("issue_status", [
  "backlog",
  "in_progress",
  "review",
  "done",
]);

export const priorityEnum = pgEnum("priority", [
  "critical",
  "high",
  "medium",
  "low",
]);

export const notificationTypeEnum = pgEnum("notification_type", [
  "mention",
  "assignment",
  "comment",
  "workspace_invite",
  "project_activity",
  "system",
]);

export const discussionCategoryEnum = pgEnum("discussion_category", [
  "general",
  "technical",
  "proposal",
  "announcement",
  "question",
]);

// ─── Tables ──────────────────────────────────────────────────────────────────

export const user = pgTable("user", {
  id: uuid("id").primaryKey().defaultRandom(),
  displayName: text("display_name").notNull(),
  username: text("username").unique().notNull(),
  email: text("email").unique().notNull(),
  password: text("password").notNull(),
  avatarUrl: text("avatar_url"),
  bio: text("bio"),
  role: userRoleEnum("role").notNull().default("member"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  lastActiveAt: timestamp("last_active_at"),
  isOnline: boolean("is_online").notNull().default(false),
});

export const session = pgTable("session", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  token: text("token").unique().notNull(),
  device: text("device"),
  browser: text("browser"),
  os: text("os"),
  location: text("location"),
  lastActiveAt: timestamp("last_active_at"),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const workspace = pgTable("workspace", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  slug: text("slug").unique().notNull(),
  ownerId: uuid("owner_id")
    .notNull()
    .references(() => user.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const workspaceMember = pgTable(
  "workspace_member",
  {
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspace.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    role: userRoleEnum("role").notNull().default("member"),
    joinedAt: timestamp("joined_at").notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.workspaceId, t.userId] })]
);

export const project = pgTable("project", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: uuid("workspace_id")
    .notNull()
    .references(() => workspace.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  key: text("key").unique().notNull(),
  status: projectStatusEnum("status").notNull().default("planning"),
  progress: integer("progress").notNull().default(0),
  ownerId: uuid("owner_id")
    .notNull()
    .references(() => user.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const projectMember = pgTable(
  "project_member",
  {
    projectId: uuid("project_id")
      .notNull()
      .references(() => project.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    role: userRoleEnum("role").notNull().default("member"),
    joinedAt: timestamp("joined_at").notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.projectId, t.userId] })]
);

export const label = pgTable("label", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => project.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  color: text("color").notNull(),
  description: text("description"),
});

export const issue = pgTable("issue", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => project.id, { onDelete: "cascade" }),
  number: integer("number").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  status: issueStatusEnum("status").notNull().default("backlog"),
  priority: priorityEnum("priority").notNull().default("medium"),
  assigneeId: uuid("assignee_id").references(() => user.id),
  reporterId: uuid("reporter_id")
    .notNull()
    .references(() => user.id),
  commentsCount: integer("comments_count").notNull().default(0),
  attachmentsCount: integer("attachments_count").notNull().default(0),
  dueDate: timestamp("due_date"),
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const issueLabel = pgTable(
  "issue_label",
  {
    issueId: uuid("issue_id")
      .notNull()
      .references(() => issue.id, { onDelete: "cascade" }),
    labelId: uuid("label_id")
      .notNull()
      .references(() => label.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.issueId, t.labelId] })]
);

export const comment = pgTable("comment", {
  id: uuid("id").primaryKey().defaultRandom(),
  issueId: uuid("issue_id").references(() => issue.id, {
    onDelete: "cascade",
  }),
  discussionId: uuid("discussion_id").references(() => discussion.id, {
    onDelete: "cascade",
  }),
  authorId: uuid("author_id")
    .notNull()
    .references(() => user.id),
  content: text("content").notNull(),
  isEdited: boolean("is_edited").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const discussion = pgTable("discussion", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id").references(() => project.id, {
    onDelete: "cascade",
  }),
  workspaceId: uuid("workspace_id")
    .notNull()
    .references(() => workspace.id, { onDelete: "cascade" }),
  category: discussionCategoryEnum("category").notNull().default("general"),
  title: text("title").notNull(),
  content: text("content").notNull(),
  authorId: uuid("author_id")
    .notNull()
    .references(() => user.id),
  repliesCount: integer("replies_count").notNull().default(0),
  viewsCount: integer("views_count").notNull().default(0),
  isPinned: boolean("is_pinned").notNull().default(false),
  isLocked: boolean("is_locked").notNull().default(false),
  tags: text("tags").array().default([]),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const discussionReply = pgTable("discussion_reply", {
  id: uuid("id").primaryKey().defaultRandom(),
  discussionId: uuid("discussion_id")
    .notNull()
    .references(() => discussion.id, { onDelete: "cascade" }),
  authorId: uuid("author_id")
    .notNull()
    .references(() => user.id),
  content: text("content").notNull(),
  isEdited: boolean("is_edited").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const file = pgTable("file", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id").references(() => project.id, {
    onDelete: "cascade",
  }),
  workspaceId: uuid("workspace_id")
    .notNull()
    .references(() => workspace.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  path: text("path").notNull(),
  type: text("type").notNull(),
  mimeType: text("mime_type"),
  size: integer("size").notNull(),
  uploadedById: uuid("uploaded_by_id")
    .notNull()
    .references(() => user.id),
  version: integer("version").notNull().default(1),
  parentId: uuid("parent_id").references((): any => file.id, {
    onDelete: "cascade",
  }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const notification = pgTable("notification", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  type: notificationTypeEnum("type").notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  actionUrl: text("action_url"),
  metadata: jsonb("metadata").default({}),
  isRead: boolean("is_read").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const activity = pgTable("activity", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: uuid("workspace_id")
    .notNull()
    .references(() => workspace.id, { onDelete: "cascade" }),
  projectId: uuid("project_id").references(() => project.id, {
    onDelete: "cascade",
  }),
  userId: uuid("user_id")
    .notNull()
    .references(() => user.id),
  type: text("type").notNull(),
  description: text("description").notNull(),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
