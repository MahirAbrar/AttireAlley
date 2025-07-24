"use client";
import { getClientProducts } from "@/services/getClientProducts";
import { useState, useEffect } from "react";
import ClientCommonListing from "@/components/CommonListingClient";
import { toast } from "react-toastify";
import LoaderBig from "@/components/LoaderBig";
import WomensHero from "@/components/WomensHero";

const PRODUCTS_PER_PAGE = 10;

const Women = () => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await getClientProducts("Women");
    if (res?.data?.data) {
      setProducts(res.data.data);
      setLoading(false);
    } else {
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
    indexOfLastProduct
  );

  const numberOfPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      {/* Hero Section */}
      <WomensHero />

      {/* Products Section */}
      <div className="min-h-screen bg-white dark:bg-backgroundDark">
        {/* Section Title */}
        <div className="mx-auto max-w-7xl px-4 pt-12 text-center">
          <h2 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
            Women&apos;s Products
          </h2>
          <p className="mb-8 text-lg text-gray-600 dark:text-gray-400">
            {products.length} items available
          </p>
        </div>

        {/* Pagination */}
        <div className="join mb-4 flex justify-center">
          {Array.from({ length: numberOfPages }, (_, index) => (
            <button
              key={index}
              className={`btn join-item ${
                index + 1 === currentPage
                  ? "btn-outline btn-primary shadow-lg "
                  : "border-2 border-primary/20 hover:border-primary/60 hover:bg-primary/10"
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

          {currentProducts.length === 0 && (
            <div className="flex items-center justify-center">
              <div className="rounded-lg bg-gray-100 p-8 text-center shadow-md dark:bg-gray-800">
                <h1 className="dark:text-primaryDark mb-2 text-2xl font-bold text-primary">
                  No products found
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  Try adjusting your search or filter criteria.
                </p>
              </div>
            </div>
          )}
        </div>
        {numberOfPages === currentPage && (
          <div className="mb-8 mt-8 rounded-lg   border p-4 text-center">
            <h1 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
              No more products available
            </h1>
            <p className="mt-1 text-gray-500 dark:text-gray-400">
              You&apos;ve reached the end of the product list.
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default Women;
