"use client";
import axios from "axios";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";

interface Product {
  product_name: string;
  product_description: string;
  price: number;
  image: string;
}

const Product = () => {
  const params = useParams();
  const [product, setProduct] = useState<Product | undefined>();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (loading) {
      getData();
    }
  }, [loading]);
  const getData = async (): Promise<void> => {
    toast.loading("Loading Data");
    try {
      const resp = await axios.post(
        `/api/product/getproducts/${params.productId}`
      );
      setProduct(resp.data);
      setLoading(false);
      console.log(resp.data);
      toast.dismiss();
    } catch (error: any) {
      setProduct();
      setLoading(false);
      toast.dismiss();
      toast.error("Something Went Wrong!");
    }
  };
  return (
    <main className="min-h-[100vh] w-full flex bg-[#f6f9fc] flex-col items-center">
      {!loading && product && (
        <section className="w-[90%] my-6 flex justify-between items-center">
          <Image
            src={product.image}
            alt="product"
            width={450}
            height={450}
            className="mr-10"
          />
          <div>
            <p className="font-semibold text-xl mb-2">{product.product_name}</p>
            <p className="mb-4">{product.product_description}</p>
            <p className="font-semibold text-xl mb-4">₹{product.price}</p>
            <div className="flex">
              <Button>Buy Now</Button>
              <Button variant={"secondary"} className="ml-4">
                Add To Cart
              </Button>
            </div>
          </div>
        </section>
      )}
    </main>
  );
};

export default Product;
