import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, name } = body;

    const user = await prismadb.user.findUnique({
      where: { email },
    });

    if (!user) {
      const newUser = await prismadb.user.create({
        data: {
          email,
          password,
          name,
        },
      });

      return new NextResponse(
        JSON.stringify({
          message: "Successfully Account Created",
          id: newUser.id,
        })
      );
    } else {
      return new NextResponse("User Already Exists", { status: 403 });
    }
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
