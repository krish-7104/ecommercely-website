"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Featured from "@/app/product/(components)/Featured";
import ProductCategoryWise from "@/app/product/(components)/ProductCategoryWise";
import Faqs from "@/app/product/(components)/faqs";
import axios from "axios";
import toast from "react-hot-toast";

interface Product {
  id: string;
  image: string;
  product_name: string;
  price: number;
  visible: Boolean;
  featured: Boolean;
  category: String;
}

interface Category {
  id: string;
  updatedAt: string;
  name: string;
  createAt: number;
  products: Product[];
}
const Home = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    const getCategoryData = async () => {
      try {
        const resp = await axios.post("/api/category/getcategory");
        const updatedProduct = resp.data.filter((category: Category) =>
          category.products.some((product: Product) => product.featured)
        );
        setData(updatedProduct);
      } catch (error: any) {
        toast.error("Something Went Wrong!");
      }
    };
    getCategoryData();
  }, []);
  return (
    <main className="min-h-[100vh] w-full flex bg-[#f6f9fc] flex-col items-center">
      <section className="w-[90%] mb-6">
        <div className="w-full my-10 flex justify-center">
          <Image
            src={require("../public/homeImage.png")}
            alt="main image"
            className="h-[300px] object-cover shadow-md rounded-xl"
            priority
          />
        </div>
        <Featured />
        {data &&
          data.map(
            (category: { id: string; name: string; products: Product[] }) => {
              return (
                <ProductCategoryWise
                  key={category.id}
                  title={category.name}
                  products={category.products}
                />
              );
            }
          )}
        <Faqs />
      </section>
    </main>
  );
};

export default Home;
