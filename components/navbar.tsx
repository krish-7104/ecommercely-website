"use client";
import { Store, ShoppingCart, Search, Minus, Plus, Trash } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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
import { setCartData, setOrderData, setUserData } from "@/redux/actions";
import axios from "axios";
import { Cart, CartProduct, InitialState, Order } from "@/redux/types";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { stockDecreasehandler } from "@/helper/stockDecrease";
import Link from "next/link";

const Navbar = () => {
  const dispatch = useDispatch();
  const cartData = useSelector((state: InitialState) => state.cart);
  const userData = useSelector((state: InitialState) => state.userData);
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    const getUserTokenData = async () => {
      try {
        const resp = await axios.get("/api/auth/user");
        dispatch(
          setUserData({
            name: resp.data.user.name,
            email: resp.data.user.email,
            id: resp.data.user.userId,
          })
        );
      } catch (error) {
        logoutHandler();
      }
    };

    getUserTokenData();
  }, [dispatch]);

  const logoutHandler = async () => {
    try {
      await axios.get("/api/auth/logout");
      toast.dismiss();
    } catch (error: any) {
      toast.dismiss();
    }
  };

  useEffect(() => {
    const getCartDataFromDB = async () => {
      const resp = await axios.post(`/api/cart/get/${userData.id}`);
      if (resp.data !== "Cart not found") {
        dispatch(setCartData(resp.data));
      }
    };
    userData.id && getCartDataFromDB();
  }, [userData.id, dispatch]);

  const updateCartInDatabase = async (data: any) => {
    try {
      await axios.post(`/api/cart/update/${cartData.id}`, data);
    } catch (error) {
      toast.error("Error In Saving Cart!");
    }
  };

  const incrementCartProduct = (id: string) => {
    stockDecreasehandler(id, {
      quantity: 1,
      type: "dec",
    });
    const existingCartItemIndex = cartData?.products.findIndex(
      (item: CartProduct) => item.productId === id
    );
    const updatedCart = cartData?.products.map(
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

  const decrementCartProduct = (id: string, quantity: number) => {
    stockDecreasehandler(id, {
      quantity: 1,
      type: "inc",
    });
    const existingCartItemIndex = cartData?.products.findIndex(
      (item: CartProduct) => item.productId === id
    );
    if (quantity === 1) {
      const updatedProducts = cartData?.products.filter(
        (item: CartProduct) => item.productId !== id
      );

      const updatedCart: Cart = {
        id: cartData.id,
        products: updatedProducts,
      };

      dispatch(setCartData(updatedCart));

      const sendData = {
        id: cartData.id,
        products: cartData?.products.filter(
          (item: CartProduct) => item.productId !== id
        ),
      };
      updateCartInDatabase(sendData);
    } else {
      let updatedCart = cartData?.products.map(
        (item: CartProduct, index: number) =>
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

  const removeProductFromCartHandler = (id: string) => {
    const sendData = {
      id: cartData.id,
      products: cartData?.products.filter(
        (item: CartProduct) => item.productId !== id
      ),
    };
    let index = cartData?.products.findIndex((item) => item.productId === id);
    stockDecreasehandler(id, {
      quantity: cartData?.products[index].quantity,
      type: "inc",
    });
    dispatch(setCartData(sendData));
    updateCartInDatabase(sendData);
  };

  const buyProductHandler = async () => {
    let productsData: {
      name: string;
      price: number;
      productId: string;
      quantity: number;
      category: string;
    }[] = [];
    let total: number = 0;
    cartData?.products.map((item: any) => {
      productsData.push({
        name: item.name,
        price: item?.price,
        productId: item?.productId,
        quantity: item?.quantity,
        category: item?.category,
      });
      total += item.quantity * item.price;
    });
    let orderData: Order = {
      userId: userData.id,
      total: total,
      products: [...productsData],
    };
    dispatch(setOrderData(orderData));
    router.push("/order");
  };

  const clearCartHandler = async () => {
    const productsToRestore: { productId: string; quantity: number }[] = [];
    const sendData = {
      id: cartData.id,
      products: [],
    };
    cartData?.products.forEach((item) => {
      productsToRestore.push({
        productId: item.productId,
        quantity: item.quantity,
      });
    });
    try {
      for (const product of productsToRestore) {
        await stockDecreasehandler(product.productId, {
          quantity: product.quantity,
          type: "inc",
        });
      }
      dispatch(setCartData(sendData));
      await updateCartInDatabase(sendData);
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  return (
    <div className="border-b w-full bg-white relative shadow-md px-6 py-3 flex justify-between items-center">
      <div
        className="font-semibold md:text-xl cursor-pointer flex justify-center items-center"
        onClick={() => router.replace("/")}
      >
        <Store className="mr-2 h-6 w-6 hidden md:block" /> Ecommercely
      </div>
      <div className="flex justify-center items-center">
        <Link href={"/product"}>
          <Search className="md:h-6 md:w-6 h-5 w-5 mr-5" />
        </Link>
        <Sheet>
          <SheetTrigger>
            <ShoppingCart className="md:h-6 md:w-6 h-5 w-5 mr-4" />
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Your Shopping Cart</SheetTitle>
              <SheetDescription>
                Here are all the products you add to your cart.
              </SheetDescription>
              <div className="w-full pt-4">
                {cartData?.products &&
                Object.keys(cartData?.products).length > 0 ? (
                  <div>
                    {Object.keys(cartData?.products).map(
                      (item: any, index: number) => (
                        <div
                          key={cartData?.products[item]?.productId!}
                          className="border-b mb-4 pb-4"
                        >
                          <p
                            className="font-medium text-xs md:text-sm cursor-pointer"
                            onClick={() =>
                              router.push(
                                `product/${cartData?.products[item]?.productId}`
                              )
                            }
                          >
                            {index + 1}. {cartData?.products[item]?.name}
                          </p>
                          <div className="flex justify-between items-center w-[95%] md:w-[90%] mt-3">
                            <div className="flex justify-center items-center bg-slate-200 rounded-md">
                              <button
                                className="flex justify-center items-center px-1 md:px-2 py-1 cursor-pointer"
                                onClick={() =>
                                  decrementCartProduct(
                                    cartData?.products[item]?.productId,
                                    cartData?.products[item]?.quantity
                                  )
                                }
                              >
                                <Minus size={16} className="mx-2" />
                              </button>
                              <p className="text-xs md:text-sm md:min-w-[20px] md:max-w-[20px] text-center">
                                {cartData?.products[item]?.quantity?.toString()}
                              </p>
                              <button
                                className="flex justify-center items-center px-1 md:px-2 py-1 cursor-pointer"
                                onClick={() =>
                                  incrementCartProduct(
                                    cartData?.products[item]?.productId
                                  )
                                }
                              >
                                <Plus size={16} className="mx-2" />
                              </button>
                            </div>
                            <p className="text-xs md:text-sm">
                              Price: ₹
                              {cartData?.products[item]?.price.toString()}
                            </p>
                            <button
                              className="flex justify-center items-center px-2 py-1 cursor-pointer"
                              onClick={() =>
                                removeProductFromCartHandler(
                                  cartData?.products[item]?.productId
                                )
                              }
                            >
                              <Trash size={16} className="mx-2" />
                            </button>
                          </div>
                        </div>
                      )
                    )}
                    <Button onClick={buyProductHandler}>Buy Now</Button>
                    <Button
                      onClick={clearCartHandler}
                      variant={"secondary"}
                      className="ml-3"
                    >
                      Clear Cart
                    </Button>
                  </div>
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
        {pathname !== "/login" &&
          pathname !== "/register" &&
          !pathname.includes("/settings/resetPassword") &&
          userData.id !== "" && (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar className="cursor-pointer select-none">
                  {userData.name !== "" && (
                    <AvatarFallback>
                      {userData?.name?.split(" ")[0]?.slice(0, 1)}
                      {userData?.name?.split(" ")[1]?.slice(0, 1)}
                    </AvatarFallback>
                  )}
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="absolute -right-2">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => router.push("/settings/profile")}
                >
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => router.push("/settings/myorders")}
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
          )}
        {pathname !== "/login" &&
          pathname !== "/register" &&
          userData.id === "" && (
            <Button
              onClick={() => router.push("/register")}
              size={"sm"}
              variant={"secondary"}
            >
              Register
            </Button>
          )}
      </div>
    </div>
  );
};

export default Navbar;
