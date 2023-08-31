"use client";
import StripePaymentForm from "@/components/StripeForm";
import { Button } from "@/components/ui/button";
import { setCartData } from "@/redux/actions";
import { InitialState, OrderProduct } from "@/redux/types";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Elements } from "@stripe/react-stripe-js";
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

  return (
    <section className="w-full">
      <section className="md:container md:w-[90%] w-[85%] mx-auto my-6">
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
        <p className="md:text-xl font-semibold">Payment Details</p>
        <Elements stripe={stripePromise}>
          <StripePaymentForm
            orderData={orderData}
            customerName={userData.name}
          />
        </Elements>
        <p className="my-5 text-center font-medium">
          Note: For Testing Purpose Add Card No: 4242 4242 4242 4242 and rest
          all details randomly.
        </p>
      </section>
    </section>
  );
};

export default Order;
