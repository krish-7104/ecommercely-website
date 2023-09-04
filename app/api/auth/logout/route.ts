import { NextResponse } from "next/server";
import { cookies } from "next/headers";
export async function GET(req: Request) {
  try {
    const response = new NextResponse("Logout successful");
    cookies().delete("token");
    return response;
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
