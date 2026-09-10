import { NextResponse } from "next/server";
import { and, eq, ne } from "drizzle-orm";
import { db } from "@/lib/db";
import { user } from "@/db/schema";
import { updateAccountSchema, updateProfileSchema } from "@/lib/validators";

const publicColumns = {
    id: user.id,
    displayName: user.displayName,
    username: user.username,
    email: user.email,
    avatarUrl: user.avatarUrl,
    bio: user.bio,
    role: user.role,
    isOnline: user.isOnline,
    lastActiveAt: user.lastActiveAt,
    createdAt: user.createdAt,
};

// TODO(auth): resolve the signed-in user instead of the first user.
async function getMe() {
    const [me] = await db.select(publicColumns).from(user).limit(1);
    return me ?? null;
}

export async function GET() {
    try {
        const me = await getMe();
        if (!me) {
            return NextResponse.json({ error: "No users exist" }, { status: 404 });
        }
        return NextResponse.json({ user: me }, { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to load profile" }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    const body = await req.json().catch(() => null);

    const profile = updateProfileSchema.safeParse(body);
    const account = updateAccountSchema.safeParse(body);
    if (!profile.success && !account.success) {
        return NextResponse.json(
            { error: profile.error.flatten() },
            { status: 400 },
        );
    }

    try {
        const [me] = await db.select({ id: user.id }).from(user).limit(1);
        if (!me) {
            return NextResponse.json({ error: "No users exist" }, { status: 404 });
        }

        const values: Partial<typeof user.$inferInsert> = {};
        if (profile.success) {
            if (profile.data.displayName !== undefined) values.displayName = profile.data.displayName;
            if (profile.data.username !== undefined) values.username = profile.data.username;
            if (profile.data.bio !== undefined) values.bio = profile.data.bio;
            if (profile.data.avatarUrl !== undefined) values.avatarUrl = profile.data.avatarUrl;
        }
        if (account.success) {
            values.email = account.data.email.toLowerCase().trim();
        }

        if (values.username !== undefined) {
            const [taken] = await db
                .select({ id: user.id })
                .from(user)
                .where(and(eq(user.username, values.username), ne(user.id, me.id)))
                .limit(1);
            if (taken) {
                return NextResponse.json({ error: "Username already taken" }, { status: 409 });
            }
        }
        if (values.email !== undefined) {
            const [taken] = await db
                .select({ id: user.id })
                .from(user)
                .where(and(eq(user.email, values.email), ne(user.id, me.id)))
                .limit(1);
            if (taken) {
                return NextResponse.json({ error: "Email already in use" }, { status: 409 });
            }
        }

        const [updated] = await db
            .update(user)
            .set(values)
            .where(eq(user.id, me.id))
            .returning(publicColumns);

        return NextResponse.json({ user: updated }, { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
    }
}

export async function DELETE() {
    try {
        const [me] = await db.select({ id: user.id }).from(user).limit(1);
        if (!me) {
            return NextResponse.json({ error: "No users exist" }, { status: 404 });
        }
        await db.delete(user).where(eq(user.id, me.id));
        return NextResponse.json({ deleted: true }, { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to delete account" }, { status: 500 });
    }
}
