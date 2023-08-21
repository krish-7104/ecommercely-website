"use client";
import { Store, ShoppingCart, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { setUserData } from "@/redux/actions";
import axios from "axios";

const Navbar = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const getUserTokenData = async () => {
      const resp = await axios.get("/api/auth/user");
      dispatch(setUserData(resp.data.user));
    };

    getUserTokenData();
  }, [dispatch]);
  const userData = useSelector((state: any) => state.userData);
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
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar className="cursor-pointer select-none">
              <AvatarFallback>
                {userData?.name?.split(" ")[0].slice(0, 1)}
                {userData?.name?.split(" ")[1].slice(0, 1)}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="absolute -right-2">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => router.push("/profile")}
            >
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => router.push("/orders")}
            >
              My Orders
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => router.push("/settings")}
            >
              Settings
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Navbar;
