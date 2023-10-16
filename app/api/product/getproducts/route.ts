import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    console.log(req.url);
    const product = await prismadb.product.findMany({
      include: {
        Category: true,
      },
      where: {
        visible: true,
      },
    });
    return NextResponse.json(product);
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
