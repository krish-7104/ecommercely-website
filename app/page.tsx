"use client";
import React from "react";
import Image from "next/image";
import Featured from "./product/(featured)";

const Home = () => {
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
        <Featured />
      </section>
    </main>
  );
};

export default Home;
