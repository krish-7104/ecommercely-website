"use client";
import React from "react";
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
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setUserData } from "@/redux/actions";
import Link from "next/link";

const Login = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const formSchema = z.object({
    email: z.string().nonempty(),
    password: z.string().nonempty(),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    toast.loading("Logging In..");
    try {
      const resp = await axios.post("/api/auth/login", values);
      toast.success("Login Successfull");
      dispatch(setUserData(resp.data.user));
      toast.dismiss();
      router.replace("/");
    } catch (error: any) {
      console.log(error);
      toast.dismiss();
      toast.error(error.response.data);
    }
  };
  return (
    <section className="relative bg-[#f6f9fc] flex justify-center items-center h-[88vh] w-full">
      <div className="md:container w-[90%] md:w-[35%] bg-white shadow-lg border rounded-md px-7 py-5">
        <p className="md:text-xl font-semibold text-center mb-6">
          Login - Ecommercely
        </p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-3 flex justify-center flex-col"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input placeholder="abc@xyz.com" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
            <p className="text-right text-sm font-medium my-3">
              <Link href={"/reset-password"}>Forget Password?</Link>
            </p>
            <Button type="submit">Login Now</Button>
          </form>
        </Form>
        <p className="text-center text-sm font-medium mt-6">
          <Link href={"/register"}>Don&apos;t Have An Account, Register?</Link>
        </p>
      </div>
    </section>
  );
};

export default Login;
