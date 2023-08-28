"use client";
import { Button } from "@/components/ui/button";
import { setCartData, setOrderData } from "@/redux/actions";
import { InitialState, OrderProduct, User } from "@/redux/types";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

const Order = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const orderData = useSelector((state: InitialState) => state.order);
  const userData = useSelector((state: InitialState) => state.userData);
  const [userProfile, setUserProfile] = useState({
    name: "",
    email: "",
    phoneno: "",
    address: "",
    country: "",
    state: "",
    city: "",
    pincode: "",
  });
  useEffect(() => {
    if (orderData.products.length == 0) {
      router.replace("/");
    }
  }, [orderData.products.length, router]);
  useEffect(() => {
    const getUserProfile = async () => {
      const resp = await axios.post("/api/profile/get", {
        id: userData.id,
      });
      setUserProfile(resp.data.user);
      if (!resp.data.user.address) {
        toast("Complete Profile Details");
        router.push("/profile");
      }
    };

    userData.id && getUserProfile();
  }, [router, userData]);
  const placeOrderHandler = async () => {
    try {
      const { data } = await axios.post("/api/order/addorder", {
        ...orderData,
      });
      toast.success("Order Placed!");
      dispatch(setCartData({ products: [], id: "" }));
      dispatch(setOrderData({ total: 0, userId: "", products: [] }));
      router.push(`/order/${data.id}`);
    } catch (error) {
      toast.error("Error In Buying Product!");
    }
  };
  return (
    <section className="w-full">
      <section className="w-[85%] mx-auto my-6">
        <div className="my-6">
          <p className="font-bold text-2xl text-center">Order Details</p>
          <div className="my-8">
            <div className="w-full flex justify-evenly items-center mb-4 border-b pb-2">
              <p className="w-3/5 font-semibold">Product Name</p>
              <p className="w-1/5 font-semibold">Price</p>
              <p className="w-1/5 font-semibold">Quantity</p>
            </div>
            {orderData &&
              orderData.products.map((item) => {
                return (
                  <div
                    key={item.productId}
                    className="w-full flex justify-evenly items-center my-2"
                  >
                    <p className="w-3/5">{item.name}</p>
                    <p className="w-1/5">₹{item.price}</p>
                    <p className="w-1/5">{item.quantity}</p>
                  </div>
                );
              })}
            <div className="w-full flex justify-evenly items-center mt-4 border-t pt-2">
              <p className="w-3/5 font-semibold">Total Price and Quantity</p>
              <p className="w-1/5 font-semibold">₹{orderData.total}</p>
              <p className="w-1/5 font-semibold">
                {orderData.products.reduce(
                  (sum: number, item: OrderProduct) => sum + item.quantity,
                  0
                )}
              </p>
            </div>
          </div>
        </div>
        <div className="my-6">
          <p className="font-bold text-2xl text-center">Personal Information</p>
          <div className="my-8">
            <p className="my-2">
              <span className="font-medium">Name: </span>
              {userProfile.name}
            </p>
            <p className="my-2">
              <span className="font-medium">Email: </span>
              {userProfile.email}
            </p>
            <p className="my-2">
              <span className="font-medium">Phone Number: </span>
              {userProfile.phoneno}
            </p>
          </div>
          <div className="my-6">
            <p className="font-bold text-2xl text-center">
              Location Information
            </p>
            <div className="my-8">
              <p className="my-2">
                <span className="font-medium">Address: </span>
                {userProfile.address}
              </p>
              <p className="my-2">
                <span className="font-medium">Country: </span>
                {userProfile.country}
              </p>
              <p className="my-2">
                <span className="font-medium">State: </span>
                {userProfile.state}
              </p>
              <p className="my-2">
                <span className="font-medium">City: </span>
                {userProfile.city}
              </p>
              <p className="my-2">
                <span className="font-medium">Pincode: </span>
                {userProfile.pincode}
              </p>
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center my-6">
          <Button
            size={"lg"}
            className="text-lg px-10 py-4"
            onClick={placeOrderHandler}
          >
            Place Order
          </Button>
        </div>
      </section>
    </section>
  );
};

export default Order;
