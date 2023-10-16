"use client";
import ProductLoadingSkeleton from "@/components/ProductLoadingSkeleton";
import ProductCard from "@/components/product-card";
import axios from "axios";
import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Filter } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState({ name: "", type: "" });
  const [data, setData] = useState<Product[]>([]);
  const [backupData, setBackupData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await axios.post("/api/product/getproducts");
        setData(data);
        setBackupData(data);
        setLoading(false);
      } catch (error: any) {
        setLoading(false);
        toast.error(error.message);
      }
    };
    getData();
  }, []);

  useEffect(() => {
    if (search !== "") {
      const updatedData = backupData.filter((item) =>
        item.product_name.toLowerCase().includes(search.toLowerCase())
      );
      setData(updatedData);
    } else {
      setData(backupData);
    }
  }, [search, backupData]);

  useEffect(() => {
    if (filter.name === "price") {
      let updatedData = [...backupData];
      if (filter.type === "low") {
        updatedData.sort((a, b) => a.price - b.price);
      } else if (filter.type === "high") {
        updatedData.sort((a, b) => b.price - a.price);
      }
      setData(updatedData);
    } else {
      setData(backupData);
    }
  }, [filter, backupData]);

  return (
    <main className="w-full mx-auto flex justify-center items-center flex-col">
      <section className="mx-auto flex justify-between items-center w-[90%] mt-6">
        <Input
          placeholder="Search Product Here..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border-2 mr-2 focus-visible:ring-0 ring-0 text-xs md:text-base relative w-[85%] md:w-[40%]"
        />
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Filter />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Price Filter</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => setFilter({ type: "low", name: "price" })}
            >
              Low To High
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setFilter({ type: "high", name: "price" })}
            >
              High To Low
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </section>
      {!loading && data.length === 0 && (
        <p className="my-6">No Products At This Moment</p>
      )}
      <section className="grid md:grid-cols-5 grid-cols-2 gap-4 w-[90%] my-6">
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
            <ProductLoadingSkeleton />
          </>
        )}
      </section>
    </main>
  );
};

export default Products;
