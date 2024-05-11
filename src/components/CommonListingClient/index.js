"use client";
import { useRouter, usePathname } from "next/navigation";
import React from "react";
import { addToCart } from "@/app/services/addToCart";
import { GlobalContext } from "@/context";
import { toast } from "react-toastify";
import { useContext } from "react";
import { getCartItems } from "@/app/services/getCartItems";

const ClientCommonListing = ({ product, params }) => {
  const router = useRouter();
  const pathname = usePathname();

  const { isAuthUser, user, setCartItemsCount } = useContext(GlobalContext);

  let redirectLink = "";
  if (pathname == "/products") {
    redirectLink = `products/${product._id}`;
  } else {
    redirectLink = `${product._id}`;
  }

  async function addItemToCart(product) {
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
      const { data } = await getCartItems(user._id);
      setCartItemsCount(data.length);
    } else {
      toast.error(res.message || "Error adding item to cart");
    }
    console.log("res is ", res);
  }
  return (
    <div className="mx-3 my-4 flex min-w-[360px] max-w-sm transform flex-col bg-base-100 shadow-xl transition duration-500 ease-in-out hover:scale-105">
      <figure onClick={() => router.push(redirectLink)}>
        <img
          src={product.imageURL}
          alt={product.name}
          className="h-60 w-full cursor-pointer rounded-xl object-cover"
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
            <h3>{product.price}</h3>
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
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientCommonListing;
