import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (session?.user?.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const id = (await params).id;
    const body = await request.json();
    const { action, note } = body; // action = "APPROVE" | "DENY"

    if (!["APPROVE", "DENY"].includes(action)) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const deleteRequest = await prisma.deleteRequest.findUnique({
      where: { id },
    });

    if (!deleteRequest) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    if (action === "APPROVE") {
      await prisma.$transaction(async (tx) => {
        await tx.deleteRequest.update({
          where: { id },
          data: { status: "APPROVED", adminNote: note },
        });

        if (deleteRequest.contentId) {
          await tx.content.update({
            where: { id: deleteRequest.contentId },
            data: { isDeleted: true },
          });
        }
        if (deleteRequest.judgementId) {
          await tx.judgement.update({
            where: { id: deleteRequest.judgementId },
            data: { isDeleted: true },
          });
        }
      });
    } else {
      await prisma.deleteRequest.update({
        where: { id },
        data: { status: "DENIED", adminNote: note },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Decide Delete Request Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
