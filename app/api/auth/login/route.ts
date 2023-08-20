import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import prismadb from "@/lib/prismadb";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, action } = body;

    const user = await prismadb.user.findUnique({
      where: { email },
    });

    if (!user || user.password !== password) {
      return new NextResponse("Invalid credentials", { status: 401 });
    }

    const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY, {
      expiresIn: "2h",
    });

    const response = new NextResponse(
      JSON.stringify({ message: "Successfully logged in" })
    );

    response.headers.set(
      "Set-Cookie",
      `token=${token}; HttpOnly; Path=/; Max-Age=86400`
    );
    // cookie will set for 1 day

    return response;
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
