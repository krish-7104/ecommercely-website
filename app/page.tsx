"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Faqs from "@/components/faqs";
import axios from "axios";
import toast from "react-hot-toast";
import ProductCategoryWise from "@/components/ProductCategoryWise";
import Featured from "@/components/Featured";

interface Product {
  id: string;
  image: string;
  product_name: string;
  price: number;
  visible: Boolean;
  featured: Boolean;
  category: String;
}

const Home = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    const getCategoryData = async () => {
      try {
        const resp = await axios.post("/api/category/getcategory");
        setData(resp.data);
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
            className="md:h-[300px] object-cover shadow-md rounded-xl"
            priority
          />
        </div>
        <Featured />
        {data &&
          data.map(
            (category: { id: string; name: string; products: Product[] }) => {
              if (category.products.length > 0)
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
