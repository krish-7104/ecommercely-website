"use client";
import axios from "axios";
import { useParams } from "next/navigation";
import React, { useEffect } from "react";
import toast from "react-hot-toast";

const GetOrder = () => {
  const param = useParams();
  useEffect(() => {
    const getOrderDatahandler = async () => {
      try {
        const { data } = await axios.post(
          `/api/order/getorder/${param.orderId}`
        );
        console.log(data);
      } catch (error: any) {
        toast.error(error.message);
      }
    };
    getOrderDatahandler();
  }, [param.orderId]);

  return <div>Order</div>;
};

export default GetOrder;
