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
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-2xl font-bold">Cart Items</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {cartItems.map((item) => (
          <div
            key={item._id}
            className="transform overflow-hidden rounded-lg bg-base-100 shadow-xl transition duration-500 ease-in-out hover:scale-105"
          >
            <figure>
              <img
                src={item.productID.imageURL[0]}
                alt={item.productID.name}
                className="h-40 w-full cursor-pointer object-cover"
                onClick={() => handleImageClick(item.productID._id)}
              />
            </figure>
            <div className="p-4">
              <h2 className="mb-2 text-lg font-bold">{item.productID.name}</h2>
              <p className="mb-4 text-sm">
                {expandedItems.includes(item._id)
                  ? item.productID.description
                  : `${item.productID.description.slice(0, 100)}...`}
                {item.productID.description.length > 100 && (
                  <span
                    className="ml-1 cursor-pointer text-blue-500"
                    onClick={() => toggleDescription(item._id)}
                  >
                    {expandedItems.includes(item._id) ? "Less" : "More"}
                  </span>
                )}
              </p>
              <div className="flex items-center justify-between">
                <div className="badge badge-outline">
                  Quantity: {item.quantity}
                </div>
                <div className="badge badge-primary">
                  Price: ${item.productID.price}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CartItemCard;
