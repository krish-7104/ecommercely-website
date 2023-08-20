"use client";
import { Store, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const Navbar = () => {
  const router = useRouter();
  return (
    <div className="borber-b w-full bg-white relative shadow-md px-6 py-3 flex justify-between items-center">
      <p
        className="font-semibold text-xl cursor-pointer flex justify-center items-center"
        onClick={() => router.replace("/")}
      >
        <Store className="mr-2 h-6 w-6" /> Ecommercely
      </p>
      <div className="flex justify-center items-center">
        <Sheet>
          <SheetTrigger>
            <Button className="mr-4" variant={"ghost"}>
              <ShoppingCart className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Your Shopping Cart</SheetTitle>
              <SheetDescription>
                Here are all the products you add to your cart.
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>

        <Avatar className="cursor-pointer">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
};

export default Navbar;
