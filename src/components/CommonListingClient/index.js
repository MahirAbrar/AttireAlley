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
    <div className="mx-3 my-4 min-w-[360px] max-w-sm bg-base-100 shadow-xl  ">
      <figure onClick={() => router.push(redirectLink)}>
        <img
          src={user.imageURL}
          alt={user.name}
          className="h-60 w-full rounded-xl object-cover"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">
          {user.name}
          {user.sale == "Yes" ? (
            <div className="badge badge-secondary">Sale</div>
          ) : (
            ""
          )}
        </h2>
        <h3>{user.price}</h3>
        <div className="card-actions justify-end">
          <div className="badge badge-outline">Category: {user.category}</div>
        </div>
        <div className="mt-4 flex justify-between gap-2">
          <button className="btn btn-warning flex-grow">Add to Cart</button>
        </div>
      </div>
    </div>
  );
};

export default ClientCommonListing;
