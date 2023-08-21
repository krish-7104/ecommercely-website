import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";
export async function POST(req: Request) {
  try {
    const { id } = await req.json();
    const user = await prismadb.user.findUnique({
      where: {
        id,
      },
    });
    if (user) {
      const modifiedUser = { ...user };
      modifiedUser.password = "";
      const response = new NextResponse(
        JSON.stringify({
          status: 200,
          user: { ...modifiedUser },
        })
      );
      return response;
    } else {
      return new NextResponse("No User Found", { status: 404 });
    }
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
