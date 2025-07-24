"use client";
import { useRouter, usePathname } from "next/navigation";
import React, { useState, useContext } from "react";
import { addToCart } from "@/services/addToCart";
import { GlobalContext } from "@/context";
import { toast } from "react-toastify";
import { getCartItems } from "@/services/getCartItems";
import Loader from "../Loader";
import Image from "next/image";

const ClientCommonListing = ({ product, viewMode = "grid" }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthUser, user, setCartItemsCount, triggerNavbarUpdate } =
    useContext(GlobalContext);
  const [expandedItems, setExpandedItems] = useState([]);
  const [loading, setLoading] = useState(false);

  let redirectLink = "";
  if (pathname === "/products") {
    redirectLink = `products/${product._id}`;
  } else {
    redirectLink = `${product._id}`;
  }

  async function addItemToCart(product) {
    setLoading(true);

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
    setLoading(false);
  }

  const toggleDescription = (itemId) => {
    if (expandedItems.includes(itemId)) {
      setExpandedItems(expandedItems.filter((id) => id !== itemId));
    } else {
      setExpandedItems([...expandedItems, itemId]);
    }
  };

  if (viewMode === "list") {
    return (
      <div className="flex w-full items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-md transition-all hover:shadow-lg dark:border-gray-700 dark:bg-gray-800">
        <figure
          onClick={() => router.push(redirectLink)}
          className="cursor-pointer"
        >
          <Image
            src={
              Array.isArray(product.imageURL)
                ? product.imageURL[0]
                : product.imageURL
            }
            alt={product.name}
            width={150}
            height={150}
            className="h-32 w-32 rounded-lg object-cover"
          />
        </figure>
        <div className="flex flex-1 flex-col gap-2">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {product.name}
                {product.onSale === "Yes" && (
                  <span className="ml-2 rounded-full bg-red-100 px-2 py-1 text-xs text-red-600">
                    SALE
                  </span>
                )}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Category: {product.category}
              </p>
            </div>
            <div className="text-right">
              {product.onSale === "Yes" ? (
                <div>
                  <p className="text-sm text-gray-500 line-through">
                    ${product.price}
                  </p>
                  <p className="text-xl font-bold text-red-600">
                    ${product.price - product.priceDrop}
                  </p>
                </div>
              ) : (
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  ${product.price}
                </p>
              )}
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {product.description.slice(0, 150)}...
          </p>
          <div className="mt-2 flex gap-2">
            <button
              className="rounded-lg bg-primary px-4 py-2 text-white transition-all hover:bg-primary/90"
              onClick={() => addItemToCart(product)}
            >
              Add to Cart {loading && <Loader />}
            </button>
            <button
              className="rounded-lg border border-primary px-4 py-2 text-primary transition-all hover:bg-primary/10"
              onClick={() => router.push(redirectLink)}
            >
              View Details
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Grid view (default)
  return (
    <div className="partial-left-border mx-3 my-4 flex min-w-[360px] max-w-sm transform flex-col border-b border-b-primary shadow-xl transition duration-500 ease-in-out hover:scale-105 hover:shadow-blue-500/30 hover:ring-primary">
      <div className="middle-line"></div>
      <figure onClick={() => router.push(redirectLink)}>
        <Image
          src={
            Array.isArray(product.imageURL)
              ? product.imageURL[0]
              : product.imageURL
          }
          alt={product.name}
          width={500}
          height={240}
          className="h-60 w-full cursor-pointer rounded-xl object-cover"
          priority
        />
      </figure>
      <div className="card-body flex-grow">
        <h2 className="card-title">
          {product.name}
          {product.onSale === "Yes" ? (
            <div className="badge badge-secondary">Sale</div>
          ) : (
            ""
          )}
        </h2>
        <p className="mb-4 text-sm">
          {expandedItems.includes(product._id)
            ? product.description
            : `${product.description.slice(0, 100)}...`}
          {product.description.length > 100 && (
            <span
              className="ml-1 cursor-pointer text-blue-500"
              onClick={() => toggleDescription(product._id)}
            >
              {expandedItems.includes(product._id) ? "Less" : "More"}
            </span>
          )}
        </p>
        {product.onSale === "Yes" ? (
          <div className="flex items-center">
            <strike>
              <h3 className="mr-2">{product.price} AUD </h3>
            </strike>
            <h3 className="text-red-600">
              {product.price - product.priceDrop} AUD
            </h3>
            <div className="badge badge-outline ml-auto">
              Category: {product.category}
            </div>
          </div>
        ) : (
          <div className="flex items-center">
            <h3>{product.price} AUD</h3>
            <div className="badge badge-outline ml-auto">
              Category: {product.category}
            </div>
          </div>
        )}
        <div className="mt-auto flex justify-between gap-2">
          <button
            className="btn btn-warning mt-auto flex-grow"
            onClick={() => addItemToCart(product)}
          >
            Add to Cart {loading && <Loader />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientCommonListing;
