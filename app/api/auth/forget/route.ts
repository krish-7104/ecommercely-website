import nodemailer from "nodemailer";
import crypto from "crypto";
import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { templateHandler } from "@/helper/emailTemplate";
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
    const tokenExpiry = new Date(Date.now() + 2 * 60 * 60 * 1000);

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
          expiresAt: tokenExpiry,
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
          expiresAt: tokenExpiry,
        },
      });
    }

    const mailOptions = {
      from: "Ecommercely <krishwork11@gmail.com>",
      to: email,
      subject: "Password Reset - Ecommercely",
      html: templateHandler(user.name, resetToken),
    };

    await transporter.sendMail(mailOptions);
    return new NextResponse("Password Reset Email Sent", { status: 200 });
  } catch (error) {
    console.error(error);
    return new NextResponse("Email Sending Failed", { status: 500 });
  }
}
