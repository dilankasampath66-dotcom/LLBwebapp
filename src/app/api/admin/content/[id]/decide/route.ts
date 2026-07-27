import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { logAudit } from "@/lib/audit";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();
    const { decision, type, note } = body;

    if (!["approve", "reject"].includes(decision)) {
      return NextResponse.json({ error: "Invalid decision" }, { status: 400 });
    }

    const status = decision === "approve" ? "APPROVED" : "REJECTED";

    if (type === "CONTENT") {
      const content = await prisma.content.update({
        where: { id },
        data: {
          status,
          reviewedById: session.user.id,
          reviewNote: note || null,
        },
      });
      await logAudit({ userId: session.user.id, action: `${decision.toUpperCase()}_CONTENT`, targetType: "Content", targetId: id, details: note || undefined });
      return NextResponse.json(content);
    } else if (type === "JUDGEMENT") {
      const judgement = await prisma.judgement.update({
        where: { id },
        data: {
          status,
          reviewedById: session.user.id,
          reviewNote: note || null,
        },
      });
      await logAudit({ userId: session.user.id, action: `${decision.toUpperCase()}_JUDGEMENT`, targetType: "Judgement", targetId: id, details: note || undefined });
      return NextResponse.json(judgement);
    } else {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error updating content status:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
