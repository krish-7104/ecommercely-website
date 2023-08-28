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
      <p className="text-xl font-semibold flex items-center">
        <Zap className="mr-2" />
        {title}
      </p>
      <Separator className="my-4" />
      <div className="grid grid-cols-4 gap-4">
        {products &&
          products.map((product: Product) => {
            if (product.visible && product.featured)
              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  feature={true}
                />
              );
          })}
      </div>
    </div>
  );
};

export default ProductCategoryWise;
