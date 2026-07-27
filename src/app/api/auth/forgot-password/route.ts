import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { forgotPasswordSchema } from "@/lib/validations/auth";
import { sendPasswordResetEmail } from "@/lib/email";
import { forgotPasswordLimiter, getIpAddress } from "@/lib/rate-limit";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const ip = getIpAddress(req);
    const rateLimit = forgotPasswordLimiter.check(ip);
    
    if (!rateLimit.success) {
      return NextResponse.json(
        { message: "Too many requests, please try again later." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { identifier } = forgotPasswordSchema.parse(body);

    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
    
    const user = await db.user.findFirst({
      where: isEmail ? { email: identifier } : { phone: identifier },
    });

    const successResponse = NextResponse.json(
      { message: "If an account exists with that email/phone, we have sent a password reset link." },
      { status: 200 }
    );

    if (!user) {
      return successResponse;
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes from now

    await db.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });

    await sendPasswordResetEmail(user.email, resetToken);

    return successResponse;
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        { message: "Validation error", errors: error.errors },
        { status: 400 }
      );
    }

    console.error("Forgot password error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
