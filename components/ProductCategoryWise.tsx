"use client";
import ProductCard from "@/components/product-card";
import { Separator } from "@/components/ui/separator";
import { Zap } from "lucide-react";
import React from "react";

interface Product {
  id: string;
  image: string;
  product_name: string;
  price: number;
  visible: Boolean;
  featured: Boolean;
  category: String;
}

const ProductCategoryWise = ({
  title,
  products,
}: {
  title: string;
  products: Product[];
}) => {
  return (
    <div className="mb-10">
      <p className="md:text-xl font-semibold flex items-center">
        <Zap className="mr-2" />
        {title}
      </p>
      <Separator className="my-4" />
      <div className="grid md:grid-cols-5 md:gap-4 grid-cols-2 gap-x-4 gap-y-6">
        {products &&
          products.map((product: Product) => {
            if (product.visible) {
              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  feature={true}
                />
              );
            }
          })}
      </div>
    </div>
  );
};

export default ProductCategoryWise;
