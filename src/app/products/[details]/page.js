"use client";
import React, { useEffect, useState } from "react";
import { getProductDetails } from "@/app/services/getProductDetails";
import { toast } from "react-toastify";
import Loader from "@/components/Loader";

const Page = ({ params }) => {
  const [productDetails, setProductDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchProductDetails();
  }, []);

  // Fetch the product details
  const fetchProductDetails = async () => {
    const response = await getProductDetails(params.details);
    if (response.success) {
      setProductDetails(response.data);
    } else {
      toast.error("Error fetching product details");
    }
    setLoading(false);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div>
      <h1>Product Details: {params.details}</h1>
    </div>
  );
};

export default Page;
