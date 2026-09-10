import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { user } from "@/db/schema";
import { changePasswordSchema } from "@/lib/validators";

export async function POST(req: Request) {
    const body = await req.json().catch(() => null);
    const parsed = changePasswordSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    try {
        // TODO(auth): resolve the signed-in user instead of the first user.
        const [me] = await db
            .select({ id: user.id, password: user.password })
            .from(user)
            .limit(1);
        if (!me) {
            return NextResponse.json({ error: "No users exist" }, { status: 404 });
        }

        const valid = await bcrypt.compare(parsed.data.currentPassword, me.password);
        if (!valid) {
            return NextResponse.json({ error: "Current password is incorrect" }, { status: 403 });
        }

        const hashed = await bcrypt.hash(parsed.data.newPassword, 10);
        await db.update(user).set({ password: hashed }).where(eq(user.id, me.id));

        return NextResponse.json({ updated: true }, { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to change password" }, { status: 500 });
    }
}
