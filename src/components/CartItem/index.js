"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const CartItemCard = ({ cartItems, handleDelete }) => {
  const router = useRouter();
  const [expandedItems, setExpandedItems] = useState([]);

  const handleImageClick = (productID) => {
    router.push(`/products/${productID}`);
  };

  const toggleDescription = (itemId) => {
    if (expandedItems.includes(itemId)) {
      setExpandedItems(expandedItems.filter((id) => id !== itemId));
    } else {
      setExpandedItems([...expandedItems, itemId]);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {cartItems?.map((item) => (
        <div
          key={item._id}
          className="relative z-0 flex transform flex-col overflow-hidden rounded-lg bg-base-100 shadow-xl transition duration-500 ease-in-out hover:scale-105"
        >
          <button
            className="absolute right-2 top-2 rounded-full bg-gray-700 p-2 text-white hover:bg-red-500"
            onClick={() => handleDelete(item)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <figure>
            <Image
              src={item.productID.imageURL[0]}
              alt={item.productID.name}
              width={500}
              height={160}
              className="h-40 w-full cursor-pointer object-cover"
              onClick={() => handleImageClick(item.productID._id)}
              priority
            />
          </figure>
          <div className="flex-grow p-4">
            <h2 className="mb-2 text-lg font-bold">{item.productID.name}</h2>
            <p className="mb-4 text-sm">
              {expandedItems.includes(item._id)
                ? // shows full description
                  item.productID.description
                : // only shows 100 characters
                  `${item.productID.description.slice(0, 100)}...`}
              {item.productID.description.length > 100 && (
                <span
                  className="ml-1 cursor-pointer text-blue-500"
                  onClick={() => toggleDescription(item._id)}
                >
                  {expandedItems.includes(item._id) ? "Less" : "More"}
                </span>
              )}
            </p>
          </div>
          <div className="flex items-center justify-between px-4 pb-4">
            <div className="badge badge-outline p-4">
              Quantity: {item.quantity}
            </div>
            {item.productID.onSale === "Yes" ? (
              <div className="flex items-center">
                <span className="mr-2 text-lg font-bold text-gray-500 line-through">
                  ${item.productID.price}
                </span>
                <span className="text-lg font-bold text-green-600">
                  ${item.productID.price - item.productID.priceDrop}
                </span>
              </div>
            ) : (
              <div className="badge text-lg font-bold text-gray-500">
                ${item.productID.price}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CartItemCard;
