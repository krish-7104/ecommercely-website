"use client";
import ProductCard from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import axios from "axios";
import { Activity } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

interface Product {
  id: string;
  image: string;
  product_name: string;
  price: number;
}

const Featured = () => {
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
    <div>
      <p className="text-xl font-semibold flex items-center">
        <Activity className="mr-2" />
        Featured Products
      </p>
      <Separator className="my-4" />
      <div className="grid grid-cols-4 gap-4">
        {!loading &&
          products &&
          products.map((product: Product) => {
            return <ProductCard key={product.id} product={product} />;
          })}
      </div>
    </div>
  );
};

export default Featured;
