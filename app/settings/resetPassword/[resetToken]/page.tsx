"use client";
import { useParams } from "next/navigation";
import React from "react";

const ForgetPassword = () => {
  const params = useParams();
  console.log(params);
  return <div>ForgetPassword</div>;
};

export default ForgetPassword;
