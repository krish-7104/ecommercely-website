import Image from "next/image";
import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
        height={200}
        alt="product"
        className="hover:scale-105 transition-all ease-linear duration-150 hover:transition-all hover:ease-linear hover:duration-150 h-[200px] object-contain"
        onClick={() => navigate.push(`/product/${product.id}`)}
      />
      <div className="flex flex-col justify-start w-full">
        <p className={`mt-2 font-medium text-sm line-clamp-2`}>
          <Link href={`/product/${product.id}`}>{product.product_name}</Link>
        </p>
        {!feature && <p className={`mt-2 font-medium`}>₹{product.price}</p>}
      </div>
    </div>
  );
};

export default ProductCard;
