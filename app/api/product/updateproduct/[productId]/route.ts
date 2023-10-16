import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  context: { params: { productId: string } }
) {
  console.log(req.url);
  const body = await req.json();
  try {
    const product = await prismadb.product.findUnique({
      where: { id: context.params.productId },
    });

    if (product) {
      if (body.type === "inc") {
        await prismadb.product.update({
          where: { id: product.id },
          data: { quantity: product.quantity + body.quantity },
        });
      } else {
        await prismadb.product.update({
          where: { id: product.id },
          data: { quantity: product.quantity - body.quantity },
        });
      }
      return new NextResponse("Product Updated!", { status: 200 });
    } else {
      return new NextResponse("Product Not Found", { status: 404 });
    }
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
