import { NextResponse } from "next/server";
import { createProjectSchema } from "@/lib/validators";
import { db } from "@/lib/db";
import { project } from "@/db/schema";

export async function POST(req: Request) {
    const body = await req.json()

    console.log(body);

    return NextResponse.json({ message : "Project API endpoint" }, { status: 200 });
}

export async function GET(req: Request) {
    
}