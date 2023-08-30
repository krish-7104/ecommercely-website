import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
var bcrypt = require("bcryptjs");

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, name } = body;

    const user = await prismadb.user.findUnique({
      where: { email },
    });

    const hashedPassword = await bcrypt.hash(password, 10);

    if (!user) {
      const newUser = await prismadb.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
        },
      });
      const token = jwt.sign(
        { userId: newUser.id, name: newUser.name, email: newUser.email },
        process.env.SECRET_KEY || "",
        {
          expiresIn: "24h",
        }
      );
      const response = new NextResponse(
        JSON.stringify({
          message: "Successfully Account Created",
          id: newUser.id,
        })
      );

      response.headers.set(
        "Set-Cookie",
        `token=${token}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}`
      );

      return response;
    } else {
      return new NextResponse("User Already Exists", { status: 403 });
    }
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
