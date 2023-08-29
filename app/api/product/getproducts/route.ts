import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const search = url.searchParams.get("search");

    let product;

    if (search) {
      product = await prismadb.product.findMany({
        where: {
          product_name: {
            contains: search as string,
            mode: "insensitive",
          },
          visible: true,
        },
        include: {
          Category: true,
        },
      });
    } else {
      product = await prismadb.product.findMany({
        include: {
          Category: true,
        },
        where: {
          visible: true,
        },
      });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
