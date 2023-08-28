import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();
    const order = await prismadb.order.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (order) {
      return NextResponse.json(order);
    } else {
      return new NextResponse("Order not found", { status: 200 });
    }
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
