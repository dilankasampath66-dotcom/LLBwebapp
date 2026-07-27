import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const deleteRequests = await prisma.deleteRequest.findMany({
      include: {
        requestedBy: { select: { id: true, fullName: true, role: true } },
        decidedBy: { select: { id: true, fullName: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(deleteRequests);
  } catch (error) {
    console.error("Error fetching delete requests:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || !["ADMIN", "SUPER_ADMIN", "TUTOR", "STUDENT"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const { contentType, contentId, reason } = body;

    if (!contentType || !contentId || !reason) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check if a pending request already exists
    const existing = await prisma.deleteRequest.findFirst({
      where: {
        contentType,
        contentId,
        status: "PENDING",
      },
    });

    if (existing) {
      return NextResponse.json({ error: "A pending delete request already exists for this content" }, { status: 400 });
    }

    const deleteRequest = await prisma.deleteRequest.create({
      data: {
        contentType,
        contentId,
        reason,
        requestedById: session.user.id,
        status: "PENDING",
      },
    });

    return NextResponse.json(deleteRequest, { status: 201 });
  } catch (error) {
    console.error("Error creating delete request:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
