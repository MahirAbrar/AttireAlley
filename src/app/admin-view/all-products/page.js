"use client";
import React, { useEffect, useState } from "react";
import AdminCommonListing from "@/components/CommonListingAdmin";
import { getProducts } from "@/services/getProducts";
import { useRouter } from "next/navigation";
import LoaderBig from "@/components/LoaderBig";
import { useContext } from "react";
import { GlobalContext } from "@/context/index";
import { deleteProduct } from "@/services/deleteProduct";

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
    setLoading(false); // Authenticated as admin, proceed to fetch products
  };

  const handleDelete = async (id) => {
    await deleteProduct(id);
    fetchProducts(); // Fetch the products again after deleting one
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background dark:bg-backgroundDark">
        <LoaderBig />
      </div>
    );
  }

  return (
    <div className="flex flex-wrap justify-center p-6">
      {products.length > 0 &&
        products.map((product) => (
          <AdminCommonListing
            key={product._id}
            user={product}
            onDelete={handleDelete}
          />
        ))}
    </div>
  );
};

export default AllProducts;
