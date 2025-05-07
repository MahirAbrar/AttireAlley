"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { GlobalContext } from "@/context/index";
import { useContext } from "react";
import Image from "next/image";
import Link from "next/link";

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
    <div className="mx-3 my-4 flex min-w-[360px] max-w-sm transform flex-col border border-gray-200 dark:shadow-md dark:shadow-primary shadow-xl transition duration-500 ease-in-out hover:scale-105">
      <figure>
        <Link href={`/products/${user._id}`}>
          <Image
            src={Array.isArray(user.imageURL) ? user.imageURL[0] : user.imageURL}
            alt={user.name}
            width={500}
            height={240}
            priority={true}
            className="h-60 w-full cursor-pointer rounded-xl object-cover"
            style={{ width: 'auto', height: 'auto' }}
          />
        </Link>
      </figure>
      <div className="card-body flex-grow">
        <h2 className="card-title">
          {user.name}
          {user.onSale === "Yes" && (
            <div className="badge badge-secondary">Sale</div>
          )}
        </h2>
        {user.onSale === "Yes" ? (
          <>
            <div className="flex items-center">
              <strike>
                <h3 className="mr-2">{user.price} AUD </h3>
              </strike>
              <h3 className="text-red-600">
                {user.price - user.priceDrop} AUD
              </h3>
              <div className="badge badge-outline ml-auto">
                Category: {user.category}
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center">
            <h3>{user.price} AUD</h3>
            <div className="badge badge-outline ml-auto">
              Category: {user.category}
            </div>
          </div>
        )}
        <div className="mt-auto flex justify-between gap-2">
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
