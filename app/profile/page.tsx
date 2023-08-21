"use client";
import { Activity } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { useSelector } from "react-redux";

const Account = () => {
  const [data, setData] = useState({});
  const userData = useSelector((state: any) => state.userData);
  useEffect(() => {
    const getUserProfile = async () => {
      const resp = await axios.post("/api/profile/get", {
        id: userData.userId,
      });
      setData(resp.data.user);
      console.log(resp.data.user);
    };
    userData.userId && getUserProfile();
  }, [userData]);

  const formSchema = z.object({
    name: z.string().nonempty(),
    email: z.string().nonempty(),
    phoneno: z.number().max(10),
    address: z.string().nonempty(),
    city: z.string().nonempty(),
    pincode: z.number().max(6),
    state: z.string().nonempty(),
    country: z.string().nonempty(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      // name: data.name,
      // email: data.email,
      // phoneno: data.phoneno,
      // address: data.address,
      // city: data.city,
      // pincode: data.pincode,
      // state: data.state,
      // country: data.country,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }
  return (
    <main className="flex w-full justify-center items-center">
      <section className="w-[80%] my-10">
        <h2 className="font-bold text-2xl flex items-center">
          <Activity className="mr-2" />
          My Profile
        </h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <p className="font-medium mt-8">User Personal Details</p>
            <Separator className="mb-4 mt-2" />
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-800">Full Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-800">
                      Email Address
                    </FormLabel>
                    <FormControl>
                      <Input {...field} type="email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phoneno"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-800">
                      Phone Number
                    </FormLabel>
                    <FormControl>
                      <Input {...field} type="number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <p className="font-medium mt-6">User Location Details</p>
            <Separator className="mb-4 mt-2" />
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-800">Country</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-800">State</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-800">City</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="pincode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-800">Pincode</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-800">Address</FormLabel>
                    <FormControl>
                      <Textarea />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="w-full flex justify-center items-center">
              <Button type="submit" className="mt-10">
                Save Profile Changes
              </Button>
            </div>
          </form>
        </Form>
      </section>
    </main>
  );
};

export default Account;
