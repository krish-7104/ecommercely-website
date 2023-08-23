"use client";
import { Store, ShoppingCart, Search, Minus, Plus, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import { setCartData, setUserData } from "@/redux/actions";
import axios from "axios";
import { CartProduct } from "@/redux/types";
import Image from "next/image";
import { toast } from "react-hot-toast";

const Navbar = () => {
  const dispatch = useDispatch();
  const cartData = useSelector((state: any) => state.cart);
  const userData = useSelector((state: any) => state.userData);
  const [search, setSearch] = useState("");
  const router = useRouter();
  useEffect(() => {
    const getUserTokenData = async () => {
      const resp = await axios.get("/api/auth/user");
      dispatch(setUserData(resp.data.user));
    };

    getUserTokenData();
  }, [dispatch]);

  useEffect(() => {
    const getCartDataFromDB = async () => {
      const resp = await axios.post(`/api/cart/get/${userData.userId}`);
      if (resp.data !== "Cart not found") {
        dispatch(setCartData(resp.data));
      }
    };
    userData.userId && getCartDataFromDB();
  }, [userData.userId, dispatch]);

  const updateCartInDatabase = async (data: any) => {
    try {
      await axios.post(`/api/cart/update/${cartData.id}`, data);
    } catch (error) {
      toast.error("Error In Saving Cart!");
    }
  };

  // const clearCartInDatabase = async (data: any) => {
  //   try {
  //     await axios.post(`/api/cart/clear/${cartData.id}`, data);
  //   } catch (error) {
  //     toast.error("Error In Clearing Cart!");
  //   }
  // };

  const incrementCartProduct = (id: String) => {
    const existingCartItemIndex = cartData.products.findIndex(
      (item: CartProduct) => item.productId === id
    );
    const updatedCart = cartData.products.map(
      (product: CartProduct, index: number) =>
        index === existingCartItemIndex
          ? { ...product, quantity: Number(product.quantity) + 1 }
          : product
    );
    const sendData = {
      id: cartData.id,
      products: updatedCart,
    };
    dispatch(setCartData(sendData));
    updateCartInDatabase(sendData);
  };

  const decrementCartProduct = (id: String, quantity: Number) => {
    const existingCartItemIndex = cartData.products.findIndex(
      (item: CartProduct) => item.productId === id
    );
    if (quantity === 1) {
      dispatch(
        setCartData(
          cartData.products.filter((item: CartProduct) => item.productId !== id)
        )
      );
      const sendData = {
        id: cartData.id,
        products: cartData.products.filter(
          (item: CartProduct) => item.productId !== id
        ),
      };
      updateCartInDatabase(sendData);
    } else {
      let updatedCart = cartData.products.map(
        (item: CartProduct, index: Number) =>
          index === existingCartItemIndex
            ? { ...item, quantity: Number(item.quantity) - 1 }
            : item
      );
      const sendData = {
        id: cartData.id,
        products: updatedCart,
      };
      dispatch(setCartData(sendData));
      updateCartInDatabase(sendData);
    }
  };

  const removeProductFromCartHandler = (id: String) => {
    const sendData = {
      id: cartData.id,
      products: cartData.products.filter(
        (item: CartProduct) => item.productId !== id
      ),
    };
    dispatch(setCartData(sendData));
    updateCartInDatabase(sendData);
  };
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
              <div className="w-full pt-4">
                {cartData.products &&
                Object.keys(cartData.products).length > 0 ? (
                  Object.keys(cartData.products).map((item, index) => (
                    <div
                      key={cartData.products[item].productId}
                      className="border-b mb-4 pb-4"
                    >
                      <p
                        className="font-medium text-sm cursor-pointer"
                        onClick={() =>
                          router.push(
                            `product/${cartData.products[item].productId}`
                          )
                        }
                      >
                        {index + 1}. {cartData.products[item].name}
                      </p>
                      <div className="flex justify-between items-center w-[90%] mt-3">
                        <div className="flex justify-center items-center bg-slate-200 rounded-md">
                          <button
                            className="flex justify-center items-center px-2 py-1 cursor-pointer"
                            onClick={() =>
                              decrementCartProduct(
                                cartData.products[item].productId,
                                cartData.products[item].quantity
                              )
                            }
                          >
                            <Minus size={16} className="mx-2" />
                          </button>
                          <p className="text-sm min-w-[20px] max-w-[20px] text-center">
                            {cartData.products[item].quantity}
                          </p>
                          <button
                            className="flex justify-center items-center px-2 py-1 cursor-pointer"
                            onClick={() =>
                              incrementCartProduct(
                                cartData.products[item].productId
                              )
                            }
                          >
                            <Plus size={16} className="mx-2" />
                          </button>
                        </div>
                        <p className="text-sm">
                          Price: ₹{cartData.products[item].price}
                        </p>
                        <button
                          className="flex justify-center items-center px-2 py-1 cursor-pointer"
                          onClick={() =>
                            removeProductFromCartHandler(
                              cartData.products[item].productId
                            )
                          }
                        >
                          <Trash size={16} className="mx-2" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex justify-center items-center w-full h-[70vh] flex-col">
                    <Image
                      src={require("../public/empty_cart.png")}
                      width={240}
                      alt="Cart Empty"
                    />
                    <p className="font-semibold mt-6">Cart Is Empty</p>
                  </div>
                )}
              </div>
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
