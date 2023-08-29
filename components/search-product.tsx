import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import axios from "axios";
import Link from "next/link";
import { InfinitySpin, Oval } from "react-loader-spinner";

type Product = {
  product_name: string;
  id: string;
};

const SearchProduct = () => {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    let timeoutId;
    if (search.length > 3) {
      setLoading(true);
      setError(null);

      timeoutId = setTimeout(async () => {
        try {
          const response = await axios.post(
            `/api/product/getproducts?search=${search}`
          );
          setData(response.data);
          setLoading(false);
        } catch (error) {
          setError("An error occurred while fetching data.");
        } finally {
          setLoading(false);
        }
      }, 500);
    } else {
      setData([]);
    }
  }, [search]);

  return (
    <div className="w-[40%] mx-auto relative overflow-visible">
      <div className="flex justify-center items-center">
        <div className="flex justify-end items-center w-full">
          <Input
            placeholder="Search Product Here..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-2 mr-2 focus-visible:ring-0 ring-0 relative"
          />
          {loading && (
            <div className="absolute right-5">
              <Oval
                height={18}
                width={18}
                color="#272d40"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
                ariaLabel="oval-loading"
                secondaryColor="#272d40"
                strokeWidth={4}
                strokeWidthSecondary={2}
              />
            </div>
          )}
        </div>
      </div>
      {data.length > 0 && search !== "" && (
        <div className="absolute w-full bg-white py-2 px-3 rounded-md border my-2 shadow-md">
          {data.map((item: Product) => {
            return (
              <p
                key={item.id}
                className={`text-sm font-medium ${
                  data.length > 1 && "border-b pb-2 mb-2"
                } cursor-pointer`}
              >
                <Link href={`/product/${item.id}`}>{item.product_name}</Link>
              </p>
            );
          })}
        </div>
      )}
      {!loading && data.length === 0 && search.length > 3 && (
        <div className="absolute w-full bg-white py-2 px-3 rounded-md border my-2 shadow-md">
          <p className="text-sm font-medium cursor-pointer">
            No Product Found...
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchProduct;
