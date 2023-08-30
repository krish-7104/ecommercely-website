import { Button } from "@/components/ui/button";
import React from "react";

const Cancel = () => {
  return (
    <main className="w-full h-[90vh] flex justify-center items-center flex-col">
      <p className="font-semibold text-2xl mb-2">Payment Cancelled</p>
      <p className="font-medium mb-2">
        Product That Your Have Selected For Order Will Be In The Cart. You Can
        Reinitiate The Order.
      </p>
      <Button>Back To Main Page</Button>
    </main>
  );
};

export default Cancel;
