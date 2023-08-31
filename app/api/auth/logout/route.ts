import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const response = new NextResponse("Logout successful");
    response.headers.set(
      "Set-Cookie",
      `token=; HttpOnly; Path=/; Expires=${new Date(0).toUTCString()}`
    );
    return response;
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
