import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  context: { params: { userId: string } }
) {
  try {
    const cart = await prismadb.cart.findFirst({
      where: {
        userId: context.params.userId,
      },
    });

    let newCart = {
      id: cart?.id,
      products: cart?.products,
    };

    if (cart) {
      return NextResponse.json(newCart);
    } else {
      return new NextResponse("Cart not found", { status: 200 });
    }
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
