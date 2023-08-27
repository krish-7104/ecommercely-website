import Image from "next/image";
import React from "react";
import { useRouter } from "next/navigation";

interface Product {
  id: string;
  image: string;
  product_name: string;
  price: number;
  category: {};
}

interface ProductCardProps {
  product: Product;
  feature: Boolean;
}
const ProductCard: React.FC<ProductCardProps> = ({ product, feature }) => {
  const navigate = useRouter();

  return (
    <div className="bg-white shadow-md rounded-lg px-4 py-6 cursor-pointer overflow-hidden flex flex-col justify-between items-center">
      <Image
        src={product.image}
        width={200}
        height={240}
        alt="product"
        className="hover:scale-105 transition-all ease-linear duration-150 hover:transition-all hover:ease-linear hover:duration-150 max-h-[240px] object-contain"
        onClick={() => navigate.push(`/product/${product.id}`)}
      />
      <div className="flex flex-col justify-between w-full">
        <p
          className={`${feature ? "mt-4" : "my-4"} font-medium text-sm`}
          onClick={() => navigate.push(`/product/${product.id}`)}
        >
          {product.product_name}
        </p>
      </div>
    </div>
  );
};

export default ProductCard;
