"use client";
import React from "react";
import Loader from "@/components/Loader";
import LoaderBig from "@/components/LoaderBig";
import { getClientProducts } from "@/app/services/getClientProducts";
import { useState, useEffect } from "react";
import ClientCommonListing from "@/components/CommonListingClient";
import { toast } from "react-toastify";

const PRODUCTS_PER_PAGE = 5;

const Women = () => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchProducts(); // Now call fetchProducts within this condition
  }, []);

  const fetchProducts = async () => {
    const res = await getClientProducts("women");
    if (res?.data?.data) {
      setProducts(res.data.data);
      setLoading(false);
    } else {
      // Handle error or empty data case
      toast.error("Failed to fetch products or data is empty.");
      setLoading(false);
    }
  };

  if (loading) {
    return <LoaderBig />;
  }

  const indexOfLastProduct = currentPage * PRODUCTS_PER_PAGE;
  const indexOfFirstProduct = indexOfLastProduct - PRODUCTS_PER_PAGE;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct,
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      {/* Pagination */}
      <div className="join">
        {Array.from(
          { length: Math.ceil(products.length / PRODUCTS_PER_PAGE) },
          (_, index) => (
            <button
              key={index}
              className={`btn join-item ${
                index + 1 === currentPage ? "btn-active" : ""
              }`}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </button>
          ),
        )}
      </div>

      <div className="flex flex-wrap justify-center p-6">
        {currentProducts.length > 0 &&
          currentProducts.map((product) => (
            <ClientCommonListing key={product._id} product={product} />
          ))}

        {currentProducts.length == 0 && <h1>No products found</h1>}
      </div>
    </>
  );
};

export default Women;
