"use client";
import React, { useEffect, useState } from "react";
import AdminCommonListing from "@/components/CommonListingAdmin";
import { getProducts } from "@/app/services/getProducts";

const AllProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await getProducts();
      setProducts(res.data.data);
    };
    fetchProducts();
  }, []);

  return (
    <div className="flex flex-wrap justify-center p-6">
      {products.length > 0 &&
        products.map((product) => (
          <AdminCommonListing key={product._id} user={product} />
        ))}
    </div>
  );
};

export default AllProducts;
