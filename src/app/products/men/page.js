"use client";
import React from "react";
import Loader from "@/components/Loader";
import { getClientProducts } from "@/app/services/getClientProducts";
import { useState, useEffect } from "react";
import ClientCommonListing from "@/components/CommonListingClient";
import { toast } from "react-toastify";

const men = () => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    setLoading(false); // Authenticated as admin, proceed to fetch products
    fetchProducts(); // Now call fetchProducts within this condition
  }, []);

  const fetchProducts = async () => {
    const res = await getClientProducts("men");
    if (res?.data?.data) {
      setProducts(res.data.data);
    } else {
      // Handle error or empty data case
      toast.error("Failed to fetch products or data is empty.");
    }
  };
  if (loading) {
    return <Loader />; // Show loading state while checking authentication and role
  }

  return (
    <div className="flex flex-wrap justify-center p-6">
      {products.length > 0 &&
        products.map((product) => (
          <ClientCommonListing key={product._id} user={product} />
        ))}
    </div>
  );
};

export default men;
