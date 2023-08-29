"use client";
import ProductLoadingSkeleton from "@/components/ProductLoadingSkeleton";
import ProductCard from "@/components/product-card";
import SearchProduct from "@/components/search-product";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

type Category = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

type Product = {
  id: string;
  product_name: string;
  product_description: string;
  price: number;
  quantity: number;
  image: string;
  createdAt: string;
  updatedAt: string;
  category: string;
  featured: boolean;
  visible: boolean;
  Category: Category;
};

const Products = () => {
  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await axios.post("/api/product/getproducts");
        console.log(data);
        setData(data);
        setLoading(false);
      } catch (error: any) {
        setLoading(false);
        toast.error(error.message);
      }
    };
    getData();
  }, []);

  return (
    <main className="w-full mx-auto flex justify-center items-start">
      <section className="grid grid-cols-4 gap-4 w-[90%]">
        {!loading &&
          data &&
          data.map((item: Product) => {
            return <ProductCard feature={false} product={item} key={item.id} />;
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
          </>
        )}
      </section>
    </main>
  );
};

export default Products;
