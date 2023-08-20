"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Activity } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { toast } from "react-hot-toast";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
const Home = () => {
  const navigate = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (loading) {
      getData();
    }
  }, [loading]);
  const getData = async (): Promise<void> => {
    toast.loading("Loading Data");
    try {
      const resp = await axios.post("/api/product/getproducts");
      setProducts(resp.data);
      setLoading(false);
      toast.dismiss();
    } catch (error: any) {
      setProducts([]);
      setLoading(false);
      toast.dismiss();
      toast.error("Something Went Wrong!");
    }
  };
  return (
    <main className="min-h-[100vh] w-full flex bg-[#f6f9fc] flex-col items-center">
      <section className="w-[90%] mb-6">
        <div className="w-full my-10 flex justify-center">
          <Image
            src={require("../public/homeImage.png")}
            alt="main image"
            className="h-[300px] object-cover shadow-md rounded-xl"
          />
        </div>
        <div>
          <p className="text-xl font-semibold flex items-center">
            <Activity className="mr-2" />
            Featured Products
          </p>
          <Separator className="my-4" />
          <div className="grid grid-cols-4 gap-4">
            {!loading &&
              products &&
              products.map((product: any) => {
                return (
                  <div
                    key={product.id}
                    className="bg-white shadow-md rounded-lg px-4 py-6 cursor-pointer overflow-hidden flex flex-col justify-between"
                    onClick={() => navigate.push(`/product/${product.id}`)}
                  >
                    <Image
                      src={product.image}
                      width={200}
                      height={400}
                      alt="product"
                      className="hover:scale-105 transition-all ease-linear duration-150 hover:transition-all hover:ease-linear hover:duration-150"
                    />
                    <div className="flex flex-col justify-between">
                      <p className="my-4 font-medium text-sm">
                        {product.product_name}
                      </p>
                      <div className="flex justify-between items-center">
                        <p className="my-4 font-medium text-right">
                          ₹{product.price}
                        </p>
                        <Button size={"sm"}>Add To Cart</Button>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
