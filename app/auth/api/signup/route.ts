import { NextResponse } from "next/server";
//import { db } from "@/lib/db";

export async function POST(req: Request) {
  const body = await req.json();

  console.log(body)
  return NextResponse.json({ message: "Connection" }, { status: 200 });

}
