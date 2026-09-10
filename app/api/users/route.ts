import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { user } from "@/db/schema";

// TODO(auth): scope to members visible to the signed-in user.
export async function GET() {
  try {
    const rows = await db
      .select({
        id: user.id,
        displayName: user.displayName,
        username: user.username,
        email: user.email,
        avatarUrl: user.avatarUrl,
        role: user.role,
        isOnline: user.isOnline,
      })
      .from(user);

    return NextResponse.json({ users: rows }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Failed to load users" }, { status: 500 });
  }
}
