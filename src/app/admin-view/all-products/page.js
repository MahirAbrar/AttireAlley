"use client";
import React, { useEffect, useState } from "react";
import AdminCommonListing from "@/components/CommonListingAdmin";
import { getProducts } from "@/app/services/getProducts";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";
import { useContext } from "react";
import { GlobalContext } from "@/context/index";

const AllProducts = () => {
  const router = useRouter();
  const { isAuthUser, user } = useContext(GlobalContext);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Check for user authentication and admin role
    if (isAuthUser !== null) {
      if (!isAuthUser || user?.role !== "admin") {
        // If not authenticated or not an admin, redirect
        router.push("/some-other-route");
        return; // Exit early to prevent further execution
      } else {
        setLoading(false); // Authenticated as admin, proceed to fetch products
        fetchProducts(); // Now call fetchProducts within this condition
      }
    }
  }, [isAuthUser, user, router]);

  const fetchProducts = async () => {
    const res = await getProducts();
    if (res?.data?.data) {
      setProducts(res.data.data);
    } else {
      // Handle error or empty data case
      console.error("Failed to fetch products or data is empty.");
    }
  };

  if (loading) {
    return <Loader />; // Show loading state while checking authentication and role
  }

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
