import Stripe from "stripe";
import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import { Product } from "@/redux/types";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-08-16",
});

export async function POST(req: Request) {
  try {
    const { orderId } = await req.json();

    const order = await prismadb.order.findFirst({
      where: {
        id: orderId,
      },
    });

    if (Array.isArray(order?.products)) {
      const lineItems = order?.products.map((product: any) => {
        return {
          price_data: {
            currency: "inr",
            product_data: {
              name: product.name,
            },
            unit_amount: product.price * 100,
          },
          quantity: product.quantity,
        };
      });

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        success_url: `https://ecommercely.vercel.com/order/${orderId}`,
        cancel_url: "https://ecommercely.vercel.com/cancel",
      });

      return new NextResponse(JSON.stringify({ id: session.id }), {
        status: 200,
      });
    }
  } catch (error) {
    return new NextResponse("Failed to create session", {
      status: 500,
    });
  }
}
