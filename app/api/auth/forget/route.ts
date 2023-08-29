import nodemailer from "nodemailer";
import crypto from "crypto";
import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASS,
  },
});

const resetTokens = new Map();

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

    await prismadb.resetToken.create({
      data: {
        userId: user.id,
        token: resetToken,
      },
    });

    const mailOptions = {
      from: "krishwork11@gmail.com",
      to: email,
      subject: "Password Reset - Ecommercely",
      text: `Click the following link to reset your password: 
      http://localhost:3000/settings/reset-password/${resetToken}`,
    };

    await transporter.sendMail(mailOptions);
    return new NextResponse("Password Reset Email Sent", { status: 200 });
  } catch (error) {
    console.error(error);
    return new NextResponse("Email Sending Failed", { status: 500 });
  }
}
