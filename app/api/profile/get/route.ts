import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";
export async function POST(req: Request) {
  try {
    const { id } = await req.json();
    const user = await prismadb.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phoneno: true,
        address: true,
        country: true,
        city: true,
        pincode: true,
        state: true,
        orders: true,
        carts: true,
        updatedAt: true,
        createdAt: true,
      },
    });
    if (user) {
      const response = new NextResponse(
        JSON.stringify({
          status: 200,
          user,
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
