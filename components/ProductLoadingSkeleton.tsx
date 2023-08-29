import React from "react";
import { Skeleton } from "./ui/skeleton";

const ProductLoadingSkeleton = () => {
  return (
    <div className="bg-white shadow-md rounded-lg px-4 py-6 cursor-pointer overflow-hidden flex flex-col justify-between items-center">
      <Skeleton className="h-[220px] w-[200px] mb-4" />
      <Skeleton className="h-4 w-[250px] mb-4" />
      <Skeleton className="h-4 w-[250px] mb-4" />
    </div>
  );
};

export default ProductLoadingSkeleton;
