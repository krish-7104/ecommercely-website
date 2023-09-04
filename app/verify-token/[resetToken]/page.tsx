"use client";
import React, { useEffect } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

const ForgetPassword = () => {
  useEffect(() => {
    const logoutHandler = async () => {
      try {
        await axios.get("/api/auth/logout");
      } catch (error: any) {
        toast.error(error.response.data);
      }
    };
    logoutHandler();
  }, []);
  const { resetToken } = useParams();
  const router = useRouter();
  const formSchema = z.object({
    password: z.string().nonempty(),
    confirmpassword: z.string().nonempty(),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmpassword: "",
    },
  });
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (values.password === values.confirmpassword) {
      toast.loading("Updating Password..");
      try {
        const resp = await axios.post("/api/auth/update-password", {
          token: resetToken,
          password: values.password,
        });
        toast.success("Updated Successfull");
        toast.dismiss();
        toast.loading("Redirecting...");
        setTimeout(() => {
          router.replace("/");
        }, 1000);
      } catch (error: any) {
        toast.dismiss();
        toast.error(error.response.data);
      }
    } else {
      toast.error("Both Password Are Different!");
    }
  };
  return (
    <section className="relative bg-[#f6f9fc] flex justify-center items-center h-[88vh] w-full">
      <div className="md:container w-[90%] md:w-[35%] bg-white shadow-lg border rounded-md px-7 py-5">
        {" "}
        <p className="text-xl font-semibold text-center mb-6">
          Update Password - Ecommercely
        </p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-3 flex justify-center flex-col"
          >
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="*********" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmpassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input placeholder="*********" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Update Password</Button>
          </form>
        </Form>
      </div>
    </section>
  );
};

export default ForgetPassword;
