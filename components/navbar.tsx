"use client";
import { Store, ShoppingCart, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [search, setSearch] = useState("");
  const router = useRouter();
  return (
    <div className="borber-b w-full bg-white relative shadow-md px-6 py-3 flex justify-between items-center">
      <div
        className="font-semibold text-xl cursor-pointer flex justify-center items-center"
        onClick={() => router.replace("/")}
      >
        <Store className="mr-2 h-6 w-6" /> Ecommercely
      </div>
      <div className="w-[40%] mx-auto flex">
        <Input
          placeholder="Search Product Here..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border-2 mr-2 focus-visible:ring-0 ring-0"
        />
        <Button size={"icon"} variant={"ghost"}>
          <Search />
        </Button>
      </div>
      <div className="flex justify-center items-center">
        <Sheet>
          <SheetTrigger>
            <ShoppingCart className="h-6 w-6 mr-4" />
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
