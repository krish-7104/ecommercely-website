"use client";
import React from "react";
import { Oval } from "react-loader-spinner";
const Loading = () => {
  return (
    <div className="h-[80vh] w-full flex justify-center items-center">
      <Oval
        height={30}
        width={30}
        color="#272d40"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
        ariaLabel="oval-loading"
        secondaryColor="#272d40"
        strokeWidth={2}
        strokeWidthSecondary={2}
      />
    </div>
  );
};

export default Loading;
