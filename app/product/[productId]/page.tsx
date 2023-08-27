"use client";
import axios from "axios";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { setCartData } from "@/redux/actions";
import { useDispatch, useSelector } from "react-redux";
import { CartProduct } from "@/redux/types";
import { Minus, Plus } from "lucide-react";

interface Product {
  product_name: string;
  product_description: string;
  price: number;
  image: string;
  id: string;
}

const Product = () => {
  const params = useParams();
  const [product, setProduct] = useState<Product | undefined>();
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const cartData = useSelector((state: any) => state.cart);
  const userData = useSelector((state: any) => state.userData);

  useEffect(() => {
    const getData = async (): Promise<void> => {
      toast.loading("Loading Data");
      try {
        const resp = await axios.post(
          `/api/product/getproducts/${params.productId}`
        );
        setProduct(resp.data);
        setLoading(false);
        console.log(resp.data);
        toast.dismiss();
      } catch (error: any) {
        setProduct(undefined);
        setLoading(false);
        toast.dismiss();
        toast.error("Something Went Wrong!");
      }
    };
    if (loading) {
      getData();
    }
  }, [loading, params.productId]);

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

  const createCartInDatabase = async (sendData: any) => {
    try {
      const { data } = await axios.post("/api/cart/create", {
        ...sendData,
        userId: userData.userId,
      });
      dispatch(
        setCartData({
          products: [...cartData.products, sendData.products],
          id: data.id,
        })
      );
    } catch (error) {
      toast.error("Error In Saving Cart!");
    }
  };

  const incrementCartProduct = (productId: string) => {
    const existingCartItemIndex = cartData.products.findIndex(
      (item: CartProduct) => item.productId === productId
    );

    let updatedCart;

    if (existingCartItemIndex === -1) {
      const newCartItem: CartProduct = {
        productId: product!.id,
        quantity: 1,
        name: product!.product_name,
        price: product!.price,
      };

      updatedCart = [...cartData.products, newCartItem];
    } else {
      updatedCart = cartData.products.map((item: CartProduct, index: number) =>
        index === existingCartItemIndex
          ? { ...item, quantity: Number(item.quantity) + 1 }
          : item
      );
    }

    const updatedData = {
      id: cartData.id,
      products: updatedCart,
    };

    if (cartData.id) {
      updateCartInDatabase(updatedData);
    } else {
      createCartInDatabase({
        products: updatedCart,
        userId: userData.userId,
      });
    }

    dispatch(setCartData(updatedData));
  };
  const decrementCartProduct = (productId: string) => {
    const existingCartItemIndex = cartData.products.findIndex(
      (item: CartProduct) => item.productId === productId
    );

    if (existingCartItemIndex === -1) {
      return;
    }

    let updatedCart;

    if (cartData.products[existingCartItemIndex].quantity === 1) {
      updatedCart = cartData.products.filter(
        (item: CartProduct) => item.productId !== productId
      );
    } else {
      updatedCart = cartData.products.map((item: CartProduct, index: number) =>
        index === existingCartItemIndex
          ? { ...item, quantity: Number(item.quantity) - 1 }
          : item
      );
    }

    const updatedData = {
      id: cartData.id,
      products: updatedCart,
    };

    dispatch(setCartData(updatedData));
    updateCartInDatabase(updatedData);
  };

  return (
    <main className="min-h-[100vh] w-full flex bg-[#f6f9fc] flex-col items-center">
      {!loading && product && (
        <section className="w-[90%] my-6 flex justify-between items-start">
          <Image
            src={product.image}
            alt="product"
            width={450}
            height={450}
            className="mr-10 w-[30%]"
          />
          <div className="w-[70%]">
            <p className="font-semibold text-xl mb-2">{product.product_name}</p>
            <p className="mb-4">{product.product_description}</p>
            <p className="font-semibold text-xl mb-4">₹{product.price}</p>
            <div className="flex">
              <Button>Buy Now</Button>
              {cartData.products.findIndex(
                (item: CartProduct) => item.productId === product.id
              ) === -1 ? (
                <Button
                  variant={"secondary"}
                  className="ml-4"
                  onClick={() => incrementCartProduct(product.id)}
                >
                  Add To Cart
                </Button>
              ) : (
                <div className="flex justify-center items-center bg-slate-100 border rounded-md ml-4">
                  <span
                    className="flex justify-center items-center px-2 py-1 cursor-pointer"
                    onClick={() => decrementCartProduct(product.id)}
                  >
                    <Minus size={16} className="mx-2" />
                  </span>
                  <p className="text-sm min-w-[20px] max-w-[20px] text-center">
                    {cartData.products.findIndex(
                      (item: CartProduct) => item.productId === product.id
                    ) === -1
                      ? 0
                      : cartData.products[
                          cartData.products.findIndex(
                            (item: CartProduct) => item.productId === product.id
                          )
                        ].quantity}
                  </p>
                  <span
                    className="flex justify-center items-center px-2 py-1 cursor-pointer"
                    onClick={() => incrementCartProduct(product.id)}
                  >
                    <Plus size={16} className="mx-2" />
                  </span>
                </div>
              )}
            </div>
          </div>
        </section>
      )}
    </main>
  );
};

export default Product;
