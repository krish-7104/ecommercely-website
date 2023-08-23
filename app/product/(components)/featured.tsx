"use client";
import ProductCard from "@/components/product-card";
import { Separator } from "@/components/ui/separator";
import axios from "axios";
import { Star } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

interface Product {
  id: string;
  image: string;
  product_name: string;
  price: number;
  visible: Boolean;
  featured: Boolean;
  category: String;
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
    <div className="mb-10">
      <p className="text-xl font-semibold flex items-center">
        <Star className="mr-2" />
        Featured Products
      </p>
      <Separator className="my-4" />
      <div className="grid grid-cols-4 gap-4">
        {!loading &&
          products &&
          products.map((product: Product) => {
            if (product.visible && product.featured)
              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  feature={true}
                />
              );
          })}
        {loading && (
          <>
            <div className="bg-white shadow-md rounded-lg px-4 py-6 cursor-pointer overflow-hidden flex flex-col justify-between items-center">
              <Skeleton className="h-[220px] w-[200px] mb-4" />
              <Skeleton className="h-4 w-[250px] mb-4" />
              <Skeleton className="h-4 w-[250px] mb-4" />
            </div>
            <div className="bg-white shadow-md rounded-lg px-4 py-6 cursor-pointer overflow-hidden flex flex-col justify-between items-center">
              <Skeleton className="h-[220px] w-[200px] mb-4" />
              <Skeleton className="h-4 w-[250px] mb-4" />
              <Skeleton className="h-4 w-[250px] mb-4" />
            </div>
            <div className="bg-white shadow-md rounded-lg px-4 py-6 cursor-pointer overflow-hidden flex flex-col justify-between items-center">
              <Skeleton className="h-[220px] w-[200px] mb-4" />
              <Skeleton className="h-4 w-[250px] mb-4" />
              <Skeleton className="h-4 w-[250px] mb-4" />
            </div>
            <div className="bg-white shadow-md rounded-lg px-4 py-6 cursor-pointer overflow-hidden flex flex-col justify-between items-center">
              <Skeleton className="h-[220px] w-[200px] mb-4" />
              <Skeleton className="h-4 w-[250px] mb-4" />
              <Skeleton className="h-4 w-[250px] mb-4" />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Featured;
