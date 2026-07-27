import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (session?.user?.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const pendingDeletes = await prisma.deleteRequest.findMany({
      where: { status: "PENDING" },
      include: {
        requestedBy: { select: { name: true, email: true } },
        content: { select: { id: true, title: true, type: true } },
        judgement: { select: { id: true, title: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ deleteRequests: pendingDeletes });
  } catch (error) {
    console.error("Get Delete Requests Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
