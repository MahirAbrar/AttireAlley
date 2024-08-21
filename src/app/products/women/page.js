"use client";
import React from "react";
import Loader from "@/components/Loader";
import LoaderBig from "@/components/LoaderBig";
import { getClientProducts } from "@/app/services/getClientProducts";
import { useState, useEffect } from "react";
import ClientCommonListing from "@/components/CommonListingClient";
import { toast } from "react-toastify";

const PRODUCTS_PER_PAGE = 8;

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
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background dark:bg-backgroundDark">
        <LoaderBig />
      </div>
    );
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

  const numberOfPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);
  return (
    <>
      {/* Pagination */}
      <div className="join">
        {Array.from({ length: numberOfPages }, (_, index) => (
          <button
            key={index}
            className={`btn join-item ${
              index + 1 === currentPage ? "btn-active" : ""
            }`}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap justify-center p-6">
        {currentProducts.length > 0 &&
          currentProducts.map((product) => (
            <ClientCommonListing key={product._id} product={product} />
          ))}

        {currentProducts.length == 0 && (
          <div className="flex items-center justify-center">
            <div className="rounded-lg bg-gray-100 p-8 text-center shadow-md dark:bg-gray-800">
              <h1 className="mb-2 text-2xl font-bold text-primary dark:text-primaryDark">
                No products found
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          </div>
        )}
      </div>
      {numberOfPages == currentPage && (
        <div className="mt-8 rounded-lg border border-gray-200 bg-gray-50 p-4 text-center dark:border-gray-600 dark:bg-gray-700">
          <h1 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
            No more products available
          </h1>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            You've reached the end of the product list.
          </p>
        </div>
      )}
    </>
  );
};

export default Women;
