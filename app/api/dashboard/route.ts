import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { user } from "@/db/schema";

export async function GET(req: Request) {
    const data = await db.query.user.findMany()
    console.log(data);
    return NextResponse.json(data)
}
