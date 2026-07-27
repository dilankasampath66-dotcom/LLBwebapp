import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { resetPasswordSchema } from "@/lib/validations/auth";
import { authLimiter, getIpAddress } from "@/lib/rate-limit";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const ip = getIpAddress(req);
    const rateLimit = authLimiter.check(ip);
    
    if (!rateLimit.success) {
      return NextResponse.json(
        { message: "Too many requests, please try again later." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { token, password } = resetPasswordSchema.parse(body);

    const user = await db.user.findUnique({
      where: { resetToken: token },
    });

    if (!user || !user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
      return NextResponse.json(
        { message: "Invalid or expired reset token" },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await db.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return NextResponse.json(
      { message: "Password reset successfully. You can now sign in." },
      { status: 200 }
    );
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        { message: "Validation error", errors: error.errors },
        { status: 400 }
      );
    }

    console.error("Reset password error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
