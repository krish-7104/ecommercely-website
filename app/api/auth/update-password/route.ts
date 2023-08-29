import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import prismadb from "@/lib/prismadb";
var bcrypt = require("bcryptjs");

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { token, password } = body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const resetTokenRecord = await prismadb.resetToken.findFirst({
      where: {
        token: token,
        expiresAt: {
          gte: new Date(),
        },
      },
    });
    if (resetTokenRecord) {
      const userId = resetTokenRecord.userId;

      const updatedUser = await prismadb.user.update({
        where: { id: userId },
        data: { password: hashedPassword },
      });

      await prismadb.resetToken.delete({
        where: { id: resetTokenRecord.id },
      });

      return new NextResponse("Password Updated", { status: 200 });
    } else {
      return new NextResponse("Invalid or Expired Token", { status: 401 });
    }
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
