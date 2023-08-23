import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  context: { params: { cartId: string } }
) {
  try {
    await prismadb.cart.delete({
      where: {
        id: context.params.cartId,
      },
    });
    return new NextResponse("Cart Cleared", { status: 200 });
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
