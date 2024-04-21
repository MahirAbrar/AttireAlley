"use client";
import React, { useEffect, useState } from "react";
import { getProductDetails } from "@/app/services/getProductDetails";
import { toast } from "react-toastify";
import Loader from "@/components/Loader";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Page = ({ params }) => {
  const [productDetails, setProductDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchProductDetails();
  }, [params.details]); // Ensure this is dependent on `params.details` if it's supposed to update on change

  // Fetch the product details
  const fetchProductDetails = async () => {
    const response = await getProductDetails(params.details);
    if (response.success) {
      setProductDetails(response.data.data);
    } else {
      toast.error("Error fetching product details");
    }
    setLoading(false);
  };

  console.log(productDetails);
  if (loading) {
    return <Loader />;
  }

  if (!productDetails) {
    return <p>No product details available</p>; // Handling case when no product details are loaded
  }
  console.log(productDetails);

  return (
    <div className=" min-h-screen w-full bg-base-200">
      {/* left side */}
      <div className="hero-content  flex-col lg:flex-row">
        <img
          src={productDetails.imageURL[0]}
          alt="Product Image"
          className="mb-auto max-w-sm rounded-lg shadow-2xl"
        />

        {/* right side */}
        <div>
          <div className="flex flex-wrap gap-6">
            <h1 className="text-5xl font-bold">{productDetails.name}</h1>

            <div className="flex w-full flex-row flex-wrap gap-4">
              <button className="btn btn-primary btn-wide mr-4">
                <FontAwesomeIcon icon={faShoppingCart} />
                Add to cart
              </button>
              {productDetails.onSale == "Yes" ? (
                <>
                  <div className="flex items-center">
                    <strike>
                      <h3 className="mr-2">{productDetails.price} AUD </h3>
                    </strike>
                    <h3>
                      {productDetails.price - productDetails.priceDrop} AUD
                    </h3>
                  </div>
                  <div className="badge badge-accent badge-outline ml-auto h-full">
                    Category: {productDetails.category}
                  </div>
                </>
              ) : (
                <div className="flex items-center">
                  <h3>{productDetails.price}</h3>
                </div>
              )}
            </div>
          </div>

          <div className="divider"></div>
          <p>Description</p>

          <p className="py-6">{productDetails.description}</p>
          <h3>Select your size</h3>
          {productDetails.sizes && productDetails.sizes.length > 0 ? (
            productDetails.sizes.map((size) => (
              <button key={size} className="btn btn-secondary m-2">
                {size}
              </button>
            ))
          ) : (
            <p>No sizes available</p>
          )}
          <p>For {productDetails.category}</p>
        </div>
      </div>
    </div>
  );
};

export default Page;
