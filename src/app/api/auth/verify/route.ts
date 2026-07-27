import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyEmailSchema } from "@/lib/validations/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token } = verifyEmailSchema.parse(body);

    const user = await db.user.findUnique({
      where: { verifyToken: token },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid or expired verification token" },
        { status: 400 }
      );
    }

    await db.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        verifyToken: null,
      },
    });

    return NextResponse.json(
      { message: "Email verified successfully. You can now sign in." },
      { status: 200 }
    );
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        { message: "Validation error", errors: error.errors },
        { status: 400 }
      );
    }

    console.error("Verify error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.redirect(new URL("/login?error=MissingToken", req.url));
    }

    const user = await db.user.findUnique({
      where: { verifyToken: token },
    });

    if (!user) {
      return NextResponse.redirect(new URL("/login?error=InvalidToken", req.url));
    }

    await db.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        verifyToken: null,
      },
    });

    return NextResponse.redirect(new URL("/login?verified=true", req.url));
  } catch (error) {
    console.error("Verify GET error:", error);
    return NextResponse.redirect(new URL("/login?error=ServerError", req.url));
  }
}
