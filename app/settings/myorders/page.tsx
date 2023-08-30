"use client";
import dateFormaterHandler from "@/helper/DateFormatter";
import { InitialState } from "@/redux/types";
import axios from "axios";
import { Activity } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Oval } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
type OrderData = {
  id: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  total: number;
  products: [];
};
type Product = {
  productId: string;
  name: string;
  price: number;
  category: string;
  quantity: number;
  createdAt: string;
};
const MyOrders = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [orders, setOrders] = useState<OrderData[]>([]);
  const userData = useSelector((state: InitialState) => state.userData);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const getAllOrders = async () => {
      try {
        const { data } = await axios.post("/api/order/getorder", {
          userId: userData.id,
        });
        const updatedOrders = data.map((item: OrderData) => {
          item.createdAt = dateFormaterHandler(item.createdAt);
          return item;
        });
        setOrders(updatedOrders);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        toast.error("Error In Getting Orders!");
      }
    };
    userData.id !== "" && getAllOrders();
  }, [userData]);

  return (
    <main className="flex w-full justify-center items-center">
      <section className="md:container w-[90%] md:w-[80%] my-10">
        <h2 className="font-bold text-xl md:text-2xl flex items-center">
          <Activity className="mr-2" />
          My Orders
        </h2>
        <section className="w-full mx-auto my-6">
          {!loading &&
            orders &&
            orders.map((order: OrderData, index: number) => {
              return (
                <div
                  key={order.id}
                  className="border-b my-4 pb-4 bg-white rounded-md px-3 py-4 border"
                >
                  <Link href={`/order/${order.id}`}>
                    <p className="text-[#272e3f] inline-block border bg-[#e8e8e8] px-2 py-1 mb-2 text-xs font-medium rounded tracking-wider">
                      {order.status}
                    </p>
                    <p className="mb-2 text-xs md:text-sm font-medium">
                      Placed On: {order.createdAt}
                    </p>
                    {orders[index].products.map((item: Product) => {
                      return (
                        <div
                          key={item.productId}
                          className="w-full flex justify-evenly items-start my-2"
                        >
                          <p className="w-4/6 text-xs md:text-sm cursor-pointer line-clamp-2 pr-4 md:pr-0">
                            {item.name}
                          </p>
                          <p className="w-1/6 text-xs md:text-base md:text-left">
                            ₹{item.price}
                          </p>
                          <p className="w-1/6 text-xs md:text-base md:text-left">
                            x{item.quantity}
                          </p>
                        </div>
                      );
                    })}
                    <div className="w-full flex justify-evenly items-center mt-4 border-t pt-2">
                      <p className="w-4/6 font-semibold text-xs md:text-base">
                        Total Price and Quantity
                      </p>
                      <p className="w-1/6 font-semibold text-xs md:text-base">
                        ₹{order.total}
                      </p>
                      <p className="w-1/6 font-semibold text-xs md:text-base">
                        {orders[index].products.reduce(
                          (sum: number, item: Product) => sum + item.quantity,
                          0
                        )}
                      </p>
                    </div>
                  </Link>
                </div>
              );
            })}
          {loading && (
            <div className="min-h-[55vh] w-full flex justify-center items-center">
              <Oval
                height={30}
                width={30}
                color="#272d40"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
                ariaLabel="oval-loading"
                secondaryColor="#272d40"
                strokeWidth={2}
                strokeWidthSecondary={2}
              />
            </div>
          )}
        </section>
      </section>
    </main>
  );
};

export default MyOrders;
