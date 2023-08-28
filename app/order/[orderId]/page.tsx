"use client";
import { InitialState } from "@/redux/types";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

type OrderData = {
  id: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  total: number;
  products: [];
};

const GetOrder = () => {
  const [orderData, setOrderData] = useState<OrderData>({
    id: "",
    status: "",
    createdAt: "",
    updatedAt: "",
    userId: "",
    total: 0,
    products: [],
  });
  const param = useParams();
  const router = useRouter();
  const userData = useSelector((state: InitialState) => state.userData);
  useEffect(() => {
    const getOrderDatahandler = async () => {
      try {
        const { data } = await axios.post(
          `/api/order/getorder/${param.orderId}`
        );
        if (userData.id === data.userId) {
          let date = new Date(data.createdAt);
          const istOffsetMilliseconds = 5.5 * 60 * 60 * 1000;
          const istTimeMilliseconds =
            new Date(date).getTime() + istOffsetMilliseconds;
          const updatedDate = new Date(istTimeMilliseconds).toLocaleString(
            "en-IN",
            { timeZone: "Asia/Kolkata" }
          );
          setOrderData({ ...data, createdAt: updatedDate });
        } else {
          toast.error("Unauthorized User");
          router.replace("/");
        }
        console.log(data);
      } catch (error: any) {
        toast.error(error.message);
      }
    };
    userData.id !== "" && getOrderDatahandler();
  }, [param.orderId, userData, router]);

  return (
    <section className="w-full h-[90vh] flex justify-center items-center">
      {orderData.id !== "" && (
        <section className="mx-auto py-8 w-[75%] min-h-[50vh] rounded-md border px-4 flex justify-evenly items-center">
          <div>
            <p className="bg-[#272e3f] inline-block text-white px-2 py-1 mb-2 text-xs font-medium rounded tracking-wider">
              {orderData.status}
            </p>
            <p className="my-3 text-slate-700">
              Your order has been placed and will soon reach to you!
            </p>
            <div className="w-full flex justify-start items-start mt-6 mb-4 border-b pb-2">
              <p className="w-3/4 font-semibold">Product</p>
              <p className="w-1/4 font-semibold">Total</p>
            </div>
            {orderData &&
              orderData.products.map((item: any) => {
                return (
                  <div
                    key={item.productId}
                    className="w-full flex justify-start items-start my-2"
                  >
                    <p className="w-3/4 cursor-pointer text-sm">
                      <Link href={`/product/${item.productId}`} target="_blank">
                        {item.name}
                      </Link>
                    </p>
                    <p className="w-1/4 text-sm">
                      {item.quantity} x ₹{item.price}
                    </p>
                  </div>
                );
              })}
            <div className="w-full flex justify-start items-start mt-4 mb-4">
              <p className="w-3/4 font-semibold">Subtotal</p>
              <p className="w-1/4 font-semibold">{orderData.total}</p>
            </div>
            <p className="mt-6 mb-2 text-sm">
              <span className="font-semibold">Order Placed:</span>{" "}
              {orderData.createdAt}
            </p>
          </div>
          <div className="flex justify-center items-center">
            <Image
              src={require("@/public/deliveryTruck.png")}
              alt="Delivery Truck"
              width={400}
              height={300}
            />
          </div>
        </section>
      )}
    </section>
  );
};

export default GetOrder;
