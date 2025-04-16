"use client";
import React, { useEffect, useState } from "react";
import { getProductDetails } from "@/services/getProductDetails";
import { toast } from "react-toastify";
import Loader from "@/components/Loader";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from 'next/image';

import { getCartItems } from "@/services/getCartItems";

import { GlobalContext } from "@/context";
import { addToCart } from "@/services/addToCart";
import { useContext } from "react";
import LoaderBig from "@/components/LoaderBig";

const Page = ({ params }) => {
  const [productDetails, setProductDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingCart, setLoadingCart] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const { isAuthUser, user, setCartItemsCount, triggerNavbarUpdate } =
    useContext(GlobalContext);

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

  async function addItemToCart(product) {
    setLoadingCart(true);
    if (!isAuthUser || !user) {
      toast.error("Please login to add items to cart");
      return;
    }

    const formData = {
      productID: product._id,
      userID: user._id,
      quantity: 1,
    };

    const res = await addToCart(formData);
    if (res.success) {
      toast.success("Item added to cart");
      const { success, data } = await getCartItems(user._id);
      if (success) {
        setCartItemsCount(data.length);
        triggerNavbarUpdate(); // Trigger the navbar update
      }
    } else {
      toast.error(res.message || "Error adding item to cart");
    }
    console.log("res is ", res);
    setLoadingCart(false);
  }

  console.log(productDetails);
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background dark:bg-backgroundDark">
        <LoaderBig />
      </div>
    );
  }

  if (!productDetails) {
    return <p>No product details available</p>; // Handling case when no product details are loaded
  }
  console.log(productDetails);

  return (
    <div className="flex min-h-screen w-screen flex-col gap-4 p-4 md:flex-row">
      {/* left side */}
      <div className="flex flex-col">
        <div className="relative w-[400px] md:w-[500px] lg:w-[500px] h-[300px] md:h-[400px] lg:h-[500px]">
          <Image
            src={productDetails.imageURL[selectedImage]}
            alt={productDetails.name}
            fill
            className="rounded-xl object-cover"
            priority
          />
        </div>
        {productDetails.imageURL && productDetails.imageURL.length > 1 && (
          <div className="flex w-full justify-center gap-2 py-2">
            {productDetails.imageURL.map((image, index) => (
              <button
                onClick={() => setSelectedImage(index)}
                className="btn btn-md"
                key={index}
              >
                {index + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* right side */}
      <div className="">
        <div className="flex flex-wrap gap-6">
          <h1 className="text-5xl font-bold">{productDetails.name}</h1>

          <div className="flex w-full flex-row flex-wrap gap-4">
            <button
              className="btn btn-primary btn-wide mr-4"
              onClick={() => addItemToCart(productDetails)}
            >
              <FontAwesomeIcon icon={faShoppingCart} />
              Add to cart {loadingCart && <Loader />}
            </button>
            {productDetails.onSale == "Yes" ? (
              <>
                <div className="flex items-center">
                  <strike>
                    <h3 className="mr-2">{productDetails.price} AUD </h3>
                  </strike>
                  <h3 className="text-2xl text-red-600">
                    {productDetails.price - productDetails.priceDrop} AUD
                  </h3>
                </div>
                <div className="badge badge-accent text-md ml-auto h-full">
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
        <h1 className="text-xl ">Description</h1>
        <p className="py-6 text-md tracking-wider">{productDetails.description}</p>
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
        <div className="divider"></div>
        <p>{productDetails.deliveryInfo}</p>
        <p>Cancel within 24 hours.</p>
        <p>Product by {productDetails.user}</p>
      </div>
    </div>
  );
};

export default Page;
