"use client";
import { Button } from "@/components/ui/button";
import { setCartData, setOrderData } from "@/redux/actions";
import { InitialState, OrderProduct } from "@/redux/types";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

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
        router.push("/settings/profile");
      }
    };

    userData.id && getUserProfile();
  }, [router, userData]);

  const placeOrderHandler = async () => {
    toast.loading("Placing Order...");
    try {
      const { data } = await axios.post("/api/order/addorder", {
        ...orderData,
      });
      const stripe = await stripePromise;
      if (!stripe) {
        toast.dismiss();
        toast.error("Stripe initialization failed.");
        return;
      }
      const session = await axios.post("/api/payment/create-session", {
        orderId: data.id,
      });
      const result = await stripe.redirectToCheckout({
        sessionId: session.data.id,
      });
      if (result.error) {
        toast.dismiss();
        toast.error("Error in starting payment session.");
      } else {
        toast.dismiss();
        toast.success("Payment successful! Order placed.");
      }
    } catch (error) {
      toast.dismiss();
      toast.error("Error in buying product.");
    }
  };

  return (
    <section className="w-full">
      <section className="md:container w-[85%] mx-auto my-6">
        <div className="my-6">
          <p className="font-bold text-lg md:text-2xl text-center">
            Order Details
          </p>
          <div className="my-8">
            <div className="w-full flex justify-evenly items-center mb-4 border-b pb-2">
              <p className="w-3/5 text-sm md:text-base font-semibold">
                Product Name
              </p>
              <p className="w-1/5 text-sm md:text-base font-semibold">Price</p>
              <p className="w-1/5 text-sm md:text-base font-semibold">
                Quantity
              </p>
            </div>
            {orderData &&
              orderData.products.map((item) => {
                return (
                  <div
                    key={item.productId}
                    className="w-full flex justify-evenly items-center my-2"
                  >
                    <p className="w-3/5 text-sm md:text-base">{item.name}</p>
                    <p className="w-1/5 text-sm md:text-base">₹{item.price}</p>
                    <p className="w-1/5 text-sm md:text-base">
                      {item.quantity}
                    </p>
                  </div>
                );
              })}
            <div className="w-full flex justify-evenly items-center mt-4 border-t pt-2">
              <p className="w-3/5 text-sm md:text-base font-semibold">
                Total Price and Quantity
              </p>
              <p className="w-1/5 text-sm md:text-base font-semibold">
                ₹{orderData.total}
              </p>
              <p className="w-1/5 text-sm md:text-base font-semibold">
                {orderData.products.reduce(
                  (sum: number, item: OrderProduct) => sum + item.quantity,
                  0
                )}
              </p>
            </div>
          </div>
        </div>
        <div className="my-6">
          <div className="flex justify-between items-baseline">
            <p className="md:text-xl font-semibold">Profile Details</p>
            <Button
              variant={"outline"}
              size={"sm"}
              onClick={() => router.push("/settings/profile")}
            >
              Edit Profile
            </Button>
          </div>
          <div className="my-8">
            <p className="my-2">
              <span className="font-medium text-sm md:text-base">Name: </span>
              {userProfile.name}
            </p>
            <p className="my-2">
              <span className="font-medium text-sm md:text-base">Email: </span>
              {userProfile.email}
            </p>
            <p className="my-2">
              <span className="font-medium text-sm md:text-base">
                Phone Number:{" "}
              </span>
              {userProfile.phoneno}
            </p>
          </div>
          <div className="my-6">
            <div className="flex justify-between items-baseline">
              <p className="md:text-xl font-semibold">Location Details</p>
              <Button
                variant={"outline"}
                size={"sm"}
                onClick={() => router.push("/settings/profile")}
              >
                Edit Profile
              </Button>
            </div>
            <div className="my-8">
              <p className="my-2">
                <span className="font-medium text-sm md:text-base">
                  Address:{" "}
                </span>
                {userProfile.address}
              </p>
              <p className="my-2">
                <span className="font-medium text-sm md:text-base">
                  Country:{" "}
                </span>
                {userProfile.country}
              </p>
              <p className="my-2">
                <span className="font-medium text-sm md:text-base">
                  State:{" "}
                </span>
                {userProfile.state}
              </p>
              <p className="my-2">
                <span className="font-medium text-sm md:text-base">City: </span>
                {userProfile.city}
              </p>
              <p className="my-2">
                <span className="font-medium text-sm md:text-base">
                  Pincode:{" "}
                </span>
                {userProfile.pincode}
              </p>
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center my-6">
          <Button
            size={"lg"}
            className="md:text-lg px-10 py-4"
            onClick={placeOrderHandler}
          >
            Make Payment
          </Button>
        </div>
      </section>
    </section>
  );
};

export default Order;
