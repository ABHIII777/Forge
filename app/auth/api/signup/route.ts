import { NextResponse } from "next/server";
import { signupSchema } from "@/lib/validators";
import bcrypt from "bcrypt";
// import { db } from "@/lib/db" 
// import { user } from "@/db/schema";

export async function POST(req: Request) {
  const body = await req.json();

  // const parsed = signupSchema.safeParse(body);

  // if (!parsed.success) {
  //   return NextResponse.json({ error: "Some error occured during parsing"}, { status: 500 })
  // }

  const { name, email, password } = body;

  const hashedPassword = await bcrypt.hash(password, 10);
  console.log(name, email, hashedPassword)
  return NextResponse.json({ message: "Dummy response" }, {status: 400 })

  // try {

  //   await db.insert(user).values({
  //     name: name,
  //     email: email,
  //     password: hashedPassword
  //   })

  //   return NextResponse.json({ message: "The Data is stored in the database" }, { status: 400 })

  // } catch (err) {
  //   console.log(err)
  //   return NextResponse.json({ error: err }, { status: 500 })
  // }
}
