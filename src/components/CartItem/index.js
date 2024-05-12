"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const CartItemCard = ({ cartItems }) => {
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
      {cartItems.map((item) => (
        <div
          key={item._id}
          className="flex transform flex-col overflow-hidden rounded-lg bg-base-100 shadow-xl transition duration-500 ease-in-out hover:scale-105"
        >
          <figure>
            <img
              src={item.productID.imageURL[0]}
              alt={item.productID.name}
              className="h-40 w-full cursor-pointer object-cover"
              onClick={() => handleImageClick(item.productID._id)}
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
            <div className="badge badge-outline">Quantity: {item.quantity}</div>
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
                Price: ${item.productID.price}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CartItemCard;
