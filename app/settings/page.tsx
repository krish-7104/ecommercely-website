"use client";
import { Button } from "@/components/ui/button";
import { InitialState } from "@/redux/types";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { Activity } from "lucide-react";
import { useRouter } from "next/navigation";
import dateFormaterHandler from "@/helper/DateFormatter";
const Settings = () => {
  const router = useRouter();
  const [user, setUser] = useState({
    name: "",
    email: "",
    phoneno: "",
    address: "",
    country: "",
    city: "",
    pincode: "",
    state: "",
    orders: [],
    carts: {
      products: [],
    },
    updatedAt: "",
    createdAt: "",
  });
  const userData = useSelector((state: InitialState) => state.userData);
  useEffect(() => {
    const getUserData = async () => {
      const { data } = await axios.post("/api/profile/get", {
        id: userData.id,
      });
      setUser(data.user);
    };
    userData.id && getUserData();
  }, [userData.id]);

  const resetPasswordHandler = async () => {
    toast.loading("Initiating Password Reset..");
    try {
      const resp = await axios.post("/api/auth/forget", { email: user.email });
      toast.dismiss();
      toast.success("Password Reset Link Send On Your Email");
    } catch (error: any) {
      toast.dismiss();
      toast.error(error.message);
    }
  };
  const logoutHandler = async () => {
    toast.loading("Initiating Logout..");
    try {
      await axios.get("/api/auth/logout");
      toast.dismiss();
      router.replace("/");
      toast.success("Logout Successfull");
    } catch (error: any) {
      toast.dismiss();
      toast.error(error.message);
    }
  };
  return (
    <main className="flex w-full justify-center items-center">
      <section className="md:container w-[95%] md:w-[80%] my-10">
        <h2 className="font-bold text-xl md:text-2xl justify-center md:justify-start flex items-center">
          <Activity className="mr-2" />
          Settings
        </h2>
        <section className="w-full mx-auto my-6">
          {user.name !== "" && (
            <div className="p-4">
              <div className="flex justify-between items-baseline">
                <p className="md:text-xl font-semibold">User Profile</p>
                <Button
                  variant={"outline"}
                  size={"sm"}
                  onClick={() => router.push("/settings/profile")}
                >
                  Edit Profile
                </Button>
              </div>
              <div className="border-b pb-4">
                <p className="my-2 text-sm md:text-base">Name: {user.name}</p>
                <p className="my-2 text-sm md:text-base">Email: {user.email}</p>
                <p className="my-2 text-sm md:text-base">
                  Registered On: {dateFormaterHandler(user.createdAt)}
                </p>
                <p className="my-2 text-sm md:text-base">
                  Updated On: {dateFormaterHandler(user.updatedAt)}
                </p>
              </div>
              <div className="flex justify-between items-baseline">
                <p className="md:text-xl font-semibold mt-4">User Location</p>
                <Button
                  variant={"outline"}
                  size={"sm"}
                  onClick={() => router.push("/settings/profile")}
                >
                  Edit Location
                </Button>
              </div>
              <div className="border-b pb-4">
                <p className="my-2 text-sm md:text-base">
                  Address: {user.address}
                </p>
                <p className="my-2 text-sm md:text-base">
                  Country: {user.country}
                </p>
                <p className="my-2 text-sm md:text-base">State: {user.state}</p>
                <p className="my-2 text-sm md:text-base">City: {user.city}</p>
                <p className="my-2 text-sm md:text-base">
                  Pincode: {user.pincode}
                </p>
              </div>
              <p className="md:text-xl font-semibold mt-4">Account Analysis</p>
              <div className="border-b pb-4">
                <p className="my-2 text-sm md:text-base">
                  Total Orders: {user?.orders ? user.orders.length : 0}
                </p>
                <p className="my-2 text-sm md:text-base">
                  Products In Cart:{" "}
                  {user?.carts?.products ? user.carts.products.length : 0}
                </p>
              </div>
              <div className="mt-6 flex justify-center items-start flex-col">
                <Button
                  variant={"secondary"}
                  size={"lg"}
                  className="mb-4"
                  onClick={resetPasswordHandler}
                >
                  Change Password
                </Button>
                <Button
                  variant={"destructive"}
                  size={"lg"}
                  onClick={logoutHandler}
                >
                  Account Logout
                </Button>
              </div>
            </div>
          )}
        </section>
      </section>
    </main>
  );
};

export default Settings;
