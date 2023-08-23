import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  context: { params: { cartId: string } }
) {
  const body = await req.json();
  try {
    const cart = await prismadb.cart.update({
      where: {
        id: context.params.cartId,
      },
      data: body,
    });

    if (cart) {
      return NextResponse.json(cart);
    } else {
      return new NextResponse("Cart not found", { status: 404 });
    }
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
