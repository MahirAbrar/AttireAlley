"use client";
import { useRouter, usePathname } from "next/navigation";
import React from "react";

const ClientCommonListing = ({ user, params }) => {
  const router = useRouter();
  const pathname = usePathname();
  let redirectLink = "";
  if (pathname == "/products") {
    redirectLink = `products/${user._id}`;
  } else {
    redirectLink = `${user._id}`;
  }
  return (
    <div className="mx-3 my-4 flex min-w-[360px] max-w-sm transform flex-col bg-base-100 shadow-xl transition duration-500 ease-in-out hover:scale-105">
      <figure onClick={() => router.push(redirectLink)}>
        <img
          src={user.imageURL}
          alt={user.name}
          className="h-60 w-full cursor-pointer rounded-xl object-cover"
        />
      </figure>
      <div className="card-body flex-grow">
        <h2 className="card-title">
          {user.name}
          {user.onSale == "Yes" ? (
            <div className="badge badge-secondary">Sale</div>
          ) : (
            ""
          )}
        </h2>
        {user.onSale == "Yes" ? (
          <div className="flex items-center">
            <strike>
              <h3 className="mr-2">{user.price} AUD </h3>
            </strike>
            <h3 className="text-red-600">{user.price - user.priceDrop} AUD</h3>
            <div className="badge badge-outline ml-auto">
              Category: {user.category}
            </div>
          </div>
        ) : (
          <div className="flex items-center">
            <h3>{user.price}</h3>
            <div className="badge badge-outline ml-auto">
              Category: {user.category}
            </div>
          </div>
        )}
        <div className="mt-auto flex justify-between gap-2">
          <button className="btn btn-warning mt-auto flex-grow">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientCommonListing;
