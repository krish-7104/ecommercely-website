import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verify } from "jsonwebtoken";
export async function GET(req: Request) {
  const cookieStore = cookies();
  const token = cookieStore.get("token");
  if (!token) {
    return new NextResponse("Unauthorized User", { status: 200 });
  }
  try {
    const data = verify(token.value, process.env.SECRET_KEY || "");
    const response = new NextResponse(
      JSON.stringify({
        message: "Verified User",
        user: data,
      })
    );
    return response;
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
