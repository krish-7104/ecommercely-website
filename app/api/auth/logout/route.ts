import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const response = new NextResponse("Logout successful");
    const expirationDate = new Date();
    expirationDate.setFullYear(expirationDate.getFullYear() - 1);
    response.headers.set(
      "Set-Cookie",
      `token=; HttpOnly; Path=/; Expires=${expirationDate.toUTCString()}`
    );
    return response;
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
