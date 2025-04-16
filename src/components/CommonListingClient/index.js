"use client";
import { useRouter, usePathname } from "next/navigation";
import React, { useState } from "react";
import { addToCart } from "@/services/addToCart";
import { GlobalContext } from "@/context";
import { toast } from "react-toastify";
import { useContext } from "react";
import { getCartItems } from "@/services/getCartItems";
import Loader from "../Loader";
import { faL } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";

const ClientCommonListing = ({ product, params }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthUser, user, setCartItemsCount, triggerNavbarUpdate } =
    useContext(GlobalContext);
  const [expandedItems, setExpandedItems] = useState([]);
  const [loading, setLoading] = useState(false);

  let redirectLink = "";
  if (pathname == "/products") {
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
    console.log("res is ", res);
    setLoading(false);
  }

  const toggleDescription = (itemId) => {
    if (expandedItems.includes(itemId)) {
      setExpandedItems(expandedItems.filter((id) => id !== itemId));
    } else {
      setExpandedItems([...expandedItems, itemId]);
    }
  };

  return (
    <div className="mx-3 my-4 flex min-w-[360px] max-w-sm transform flex-col shadow-xl hover:shadow-blue-500/30 border-b border-b-primary hover:ring-primary transition duration-500 ease-in-out hover:scale-105 partial-left-border">
      <div className="middle-line"></div>
      <figure onClick={() => router.push(redirectLink)}>
        <Image
          src={Array.isArray(product.imageURL) ? product.imageURL[0] : product.imageURL}
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
          {product.onSale == "Yes" ? (
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
        {product.onSale == "Yes" ? (
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
