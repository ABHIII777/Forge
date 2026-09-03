import { NextResponse } from "next/server";
import { signupSchema } from "@/lib/validators";
import bcrypt from "bcrypt";
import { db } from "@/lib/db" 
import { user } from "@/db/schema";

export async function POST(req: Request) {
  const body = await req.json();

  const parsed = signupSchema.safeParse(body);

  if (!parsed.success) {
    console.log(parsed.error.flatten())
    return NextResponse.json({ error: parsed.error}, { status: 500 })
  }

  const { fullName, email, username, password } = body;

  const hashedPassword = await bcrypt.hash(password, 10);

  try {

    await db.insert(user).values({
      displayName: fullName,
      username: username,
      email: email,
      password: hashedPassword
    })

    return NextResponse.json({ message: "The Data is stored in the database" }, { status: 200 })

  } catch (err) {
    console.log(err)
    return NextResponse.json({ error: err }, { status: 500 })
  }
}
