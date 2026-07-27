import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type"); 

    if (type === "judgement") {
      const judgements = await prisma.judgement.findMany({
        where: { status: "PENDING_REVIEW", deletedAt: null },
        include: {
          createdBy: { select: { id: true, fullName: true, email: true } },
        },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json(judgements);
    } else {
      const content = await prisma.content.findMany({
        where: { status: "PENDING_REVIEW", deletedAt: null },
        include: {
          subject: true,
          createdBy: { select: { id: true, fullName: true, email: true } },
        },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json(content);
    }
  } catch (error) {
    console.error("Error fetching content queue:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
