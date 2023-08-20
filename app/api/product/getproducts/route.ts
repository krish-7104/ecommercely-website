import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";
export async function POST(req: Request) {
  try {
    const product = await prismadb.product.findMany({
      include: {
        Category: true,
      },
    });
    return NextResponse.json(product);
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
