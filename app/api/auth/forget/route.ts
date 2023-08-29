import nodemailer from "nodemailer";
import crypto from "crypto";
import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASS,
  },
});

export async function POST(req: Request, res: Response) {
  try {
    const { email } = await req.json();
    const user = await prismadb.user.findFirst({
      where: {
        email: email,
      },
    });

    if (!user) {
      return new NextResponse("User Not Found!", { status: 404 });
    }
    const resetToken = crypto.randomBytes(20).toString("hex");

    const findToken = await prismadb.resetToken.findUnique({
      where: {
        userId: user.id,
      },
    });

    if (!findToken) {
      await prismadb.resetToken.create({
        data: {
          userId: user.id,
          token: resetToken,
        },
      });
    } else {
      await prismadb.resetToken.delete({
        where: {
          id: findToken.id,
        },
      });
      await prismadb.resetToken.create({
        data: {
          userId: user.id,
          token: resetToken,
        },
      });
    }

    const mailOptions = {
      from: "krishwork11@gmail.com",
      to: email,
      subject: "Password Reset - Ecommercely",
      html: `<p>Hello,</p>
      <p>You've requested a password reset for your account.</p>
      <p>Click the following link to reset your password:</p>
      <a href=http://localhost:3000/settings/resetPassword/${resetToken}>Reset Password</a>
      <p>If you didn't request this, please ignore this email.</p>
      <p>Best regards,</p>
      <p>Team Ecommercely</p>`,
    };

    await transporter.sendMail(mailOptions);
    return new NextResponse("Password Reset Email Sent", { status: 200 });
  } catch (error) {
    console.error(error);
    return new NextResponse("Email Sending Failed", { status: 500 });
  }
}
