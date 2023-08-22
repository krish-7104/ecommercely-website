import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
var bcrypt = require("bcryptjs");

export async function PUT(
  req: Request,
  context: { params: { updateId: string } }
) {
  try {
    const body = await req.json();
    await prismadb.user.update({
      where: { id: context.params.updateId },
      data: body,
    });
    return new NextResponse(
      JSON.stringify({
        message: "Successfully Updated",
      })
    );
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
