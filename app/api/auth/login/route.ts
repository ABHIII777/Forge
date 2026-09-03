import { NextResponse } from "next/server";
import { loginSchema } from "@/lib/validators";
import { db } from "@/lib/db";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt"

export async function POST(req: Request) {
  const body = await req.json();

  const parsed = loginSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten()}, { status: 500 })
  }

  const { email, password } = parsed.data;

  const client = await db.query.user.findFirst({
    where: eq(user?.email, email)
  })

  if (!client) {
    return NextResponse.json({ message: "Account not found"}, { status: 404 })
  }

  const validClient = await bcrypt.compare(password, client.password)

  if (!validClient) {
    return NextResponse.json({ message: "Invalid credentials" }, { status: 400 })
  }

  return NextResponse.json({ message: "Successful login !!" }, { status: 200 });

}
