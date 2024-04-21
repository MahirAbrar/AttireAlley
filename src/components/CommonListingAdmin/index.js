"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { GlobalContext } from "@/context/index";
import { useContext } from "react";
import { StarIcon } from "@heroicons/react/20/solid";

const AdminCommonListing = ({ user, onDelete }) => {
  const { updateItem, setUpdateItem } = useContext(GlobalContext);
  const router = useRouter();

  const handleUpdate = (item) => {
    setUpdateItem(item);
    router.push(`/admin-view/update-product`);
  };

  const handleDelete = (item) => {
    onDelete(item._id);
  };

  return (
    <div className="mx-3 my-4 min-w-[360px] max-w-sm bg-base-100 shadow-xl  ">
      <figure>
        <img
          src={user.imageURL}
          alt={user.name}
          className="h-60 w-full rounded-xl object-cover"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">
          {user.name}
          {user.onSale == "Yes" ? (
            <div className="badge badge-secondary">Sale</div>
          ) : (
            ""
          )}
        </h2>
        {user.onSale == "Yes" ? (
          <>
            <strike>
              <h3>{user.price} AUD </h3>
            </strike>
            <h3>{user.price - user.priceDrop} AUD</h3>
          </>
        ) : (
          <h3>{user.price}</h3>
        )}
        <div className="card-actions justify-end">
          <div className="badge badge-outline">Category: {user.category}</div>
        </div>
        <div className="mt-4 flex justify-between gap-2">
          <button
            className="btn btn-accent flex-grow"
            onClick={() => handleUpdate(user)}
          >
            Update
          </button>
          <button
            className="btn btn-warning flex-grow"
            onClick={() => handleDelete(user)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminCommonListing;
