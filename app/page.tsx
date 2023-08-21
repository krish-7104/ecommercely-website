"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Featured from "./product/(featured)";
const Home = () => {
  const [search, setSearch] = useState("");
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
        <div className="my-10 w-[50%] mx-auto flex">
          <Input
            placeholder="Search Product Here..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-2 mr-2 focus-visible:ring-0 ring-0"
          />
          <Button size={"icon"} variant={"ghost"}>
            <Search />
          </Button>
        </div>
        <Featured />
      </section>
    </main>
  );
};

export default Home;
