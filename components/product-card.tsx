import Image from "next/image";
import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface Product {
  id: string;
  image: string;
  product_name: string;
  price: number;
}

interface ProductCardProps {
  product: Product;
}
const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useRouter();
  return (
    <div
      className="bg-white shadow-md rounded-lg px-4 py-6 cursor-pointer overflow-hidden flex flex-col justify-between items-center"
      onClick={() => navigate.push(`/product/${product.id}`)}
    >
      <Image
        src={product.image}
        width={200}
        height={400}
        alt="product"
        className="hover:scale-105 transition-all ease-linear duration-150 hover:transition-all hover:ease-linear hover:duration-150"
      />
      <div className="flex flex-col justify-between w-full">
        <p className="my-4 font-medium text-sm">{product.product_name}</p>
        <div className="flex justify-between items-center">
          <p className="my-4 font-medium text-right text-lg">
            ₹{product.price}
          </p>
          <Button size={"sm"}>Add To Cart</Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
