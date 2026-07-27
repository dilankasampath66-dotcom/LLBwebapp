import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    const session = await auth();
    if (session?.user?.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const admins = await prisma.user.findMany({
      where: {
        role: "ADMIN",
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ admins });
  } catch (error) {
    console.error("Get Admins Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (session?.user?.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "Email already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash: hashedPassword,
        role: "ADMIN",
        isActive: true,
      },
      select: { id: true, name: true, email: true },
    });

    return NextResponse.json({ admin });
  } catch (error) {
    console.error("Create Admin Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
