import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { setCartData } from "@/redux/actions";
import { Cart, CartProduct, InitialState } from "@/redux/types";
import axios from "axios";
import { toast } from "react-hot-toast";

interface Product {
  id: string;
  image: string;
  product_name: string;
  price: number;
  category: string;
}

interface ProductCardProps {
  product: Product;
}
const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useRouter();
  const cartData = useSelector((state: any) => state.cart);
  const userData = useSelector((state: any) => state.userData);
  const dispatch = useDispatch();
  const [existingCartItemIndex, setExistingCartItemIndex] = useState<Number>();

  useEffect(() => {
    const index = cartData?.products?.findIndex(
      (item: CartProduct) => item.productId === product.id
    );
    setExistingCartItemIndex(index);
  }, [cartData, product.id]);

  const createCartInDatabase = async (sendData: any) => {
    try {
      const { data } = await axios.post("/api/cart/create", {
        ...sendData,
        userId: userData.userId,
      });
      dispatch(setCartData({ products: sendData.products, id: data.id }));
    } catch (error) {
      toast.error("Error In Saving Cart!");
    }
  };

  const updateCartInDatabase = async (data: any) => {
    try {
      await axios.post(`/api/cart/update/${cartData.id}`, data);
    } catch (error) {
      toast.error("Error In Saving Cart!");
    }
  };

  const addToCartHandler = () => {
    let updatedCart;
    if (existingCartItemIndex !== -1) {
      updatedCart = cartData.map((item: CartProduct, index: Number) =>
        index === existingCartItemIndex
          ? { ...item, quantity: Number(item.quantity) + 1 }
          : item
      );
      const sendData = {
        id: cartData.id,
        products: updatedCart,
      };
      updateCartInDatabase(sendData);
      dispatch(setCartData(sendData));
    } else {
      updatedCart = [
        ...cartData.products,
        {
          productId: product.id,
          name: product.product_name,
          price: product.price,
          quantity: 1,
          category: product.category,
        },
      ];
      const sendData = {
        products: updatedCart,
      };
      createCartInDatabase(sendData);
    }
  };

  const removeFromCartHandler = () => {
    if (existingCartItemIndex !== -1) {
      dispatch(
        setCartData(
          cartData.products.filter(
            (item: CartProduct) => item.productId !== product.id
          )
        )
      );
      const sendData = {
        id: cartData.id,
        products: cartData.products.filter(
          (item: CartProduct) => item.productId !== product.id
        ),
      };
      updateCartInDatabase(sendData);
    }
  };
  return (
    <div className="bg-white shadow-md rounded-lg px-4 py-6 cursor-pointer overflow-hidden flex flex-col justify-between items-center">
      <Image
        src={product.image}
        width={200}
        height={240}
        alt="product"
        className="hover:scale-105 transition-all ease-linear duration-150 hover:transition-all hover:ease-linear hover:duration-150 max-h-[240px] object-contain"
        onClick={() => navigate.push(`/product/${product.id}`)}
      />
      <div className="flex flex-col justify-between w-full">
        <p
          className="my-4 font-medium text-sm"
          onClick={() => navigate.push(`/product/${product.id}`)}
        >
          {product.product_name}
        </p>
        <div className="flex justify-between items-center">
          <p className="my-4 font-medium text-right text-lg">
            ₹{product.price}
          </p>
          {existingCartItemIndex === -1 ? (
            <Button size={"sm"} onClick={addToCartHandler}>
              Add To Cart
            </Button>
          ) : (
            <Button size={"sm"} onClick={removeFromCartHandler}>
              Remove From Cart
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
