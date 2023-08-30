"use client";
import ProductCard from "@/components/product-card";
import { Separator } from "@/components/ui/separator";
import axios from "axios";
import { Star } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import ProductLoadingSkeleton from "@/components/ProductLoadingSkeleton";

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
      <p className="md:text-xl font-semibold flex items-center flex-wrap">
        <Star className="mr-2" />
        Featured Products
      </p>
      <Separator className="my-4" />
      <div className="grid md:grid-cols-5 md:gap-4 grid-cols-2 gap-x-4 gap-y-6">
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
            <ProductLoadingSkeleton />
            <ProductLoadingSkeleton />
            <ProductLoadingSkeleton />
            <ProductLoadingSkeleton />
            <ProductLoadingSkeleton />
            <ProductLoadingSkeleton />
            <ProductLoadingSkeleton />
            <ProductLoadingSkeleton />
            <ProductLoadingSkeleton />
            <ProductLoadingSkeleton />
          </>
        )}
      </div>
    </div>
  );
};

export default Featured;
