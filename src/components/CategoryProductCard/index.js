"use client";
import React, { useState, useContext } from "react";
import Link from "next/link";
import Image from "next/image";
import { addToCart } from "@/services/addToCart";
import { getCartItems } from "@/services/getCartItems";
import { GlobalContext } from "@/context";
import { toast } from "react-toastify";

// TODO: color field not on Product model — color filter and color count display are non-functional placeholders

const CategoryProductCard = ({ product, category }) => {
  const { isAuthUser, user, setCartItemsCount, triggerNavbarUpdate } =
    useContext(GlobalContext);
  const [addingToCart, setAddingToCart] = useState(false);

  const imageURL = Array.isArray(product.imageURL)
    ? product.imageURL[0]
    : product.imageURL;

  const shortId = String(product._id).slice(-6);
  const effectivePrice =
    product.onSale === "Yes"
      ? product.price - (product.priceDrop || 0)
      : product.price;
  const originalPrice = product.price;

  const sizesDisplay = Array.isArray(product.sizes)
    ? product.sizes.map((s) => s.toUpperCase()).join(" ")
    : "";

  async function addItemToCart(product) {
    if (addingToCart) return;
    setAddingToCart(true);

    if (!isAuthUser || !user) {
      toast.error("Please login to add items to cart");
      setAddingToCart(false);
      return;
    }

    const res = await addToCart({
      productID: product._id,
      userID: user._id,
      quantity: 1,
    });

    if (res.success) {
      toast.success("Item added to cart");
      const { success, data } = await getCartItems(user._id);
      if (success) {
        setCartItemsCount(data.length);
        triggerNavbarUpdate();
      }
    } else {
      toast.error(res.message || "Error adding item to cart");
    }

    setAddingToCart(false);
  }

  return (
    <Link href={`/products/${category}/${product._id}`} className="group block">
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-[#f1efe8] dark:bg-[#15191a]">
        {imageURL ? (
          <Image
            src={imageURL}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 25vw, 50vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="label text-black/30 dark:text-paper/30">No image</span>
          </div>
        )}

        {/* SKU pill */}
        <div className="absolute left-2 top-2 label tabular bg-white/95 dark:bg-backgroundDark/90 px-2 py-0.5 text-ink dark:text-paper">
          SKU.{shortId}
        </div>

        {/* SALE pill */}
        {product.onSale === "Yes" && (
          <div className="absolute right-2 top-2 label bg-secondary text-white px-2 py-0.5">
            SALE
          </div>
        )}

        {/* Quick Add bar — visible on hover */}
        <div className="absolute inset-x-0 bottom-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addItemToCart(product);
            }}
            disabled={addingToCart}
            className="w-full bg-ink text-paper py-2.5 label disabled:opacity-60"
          >
            {addingToCart ? "Adding…" : `Quick add — $${effectivePrice.toFixed(2)}`}
          </button>
        </div>
      </div>

      {/* Meta */}
      <div className="mt-3 grid grid-cols-[1fr_auto] gap-x-3 gap-y-1 items-baseline border-b border-black/10 dark:border-white/10 pb-3">
        <div className="text-[14px] text-ink dark:text-paper truncate">
          {product.name}
        </div>
        <div className="text-[14px] tabular text-right">
          {product.onSale === "Yes" ? (
            <>
              <span className="text-secondary">${effectivePrice.toFixed(2)}</span>
              <span className="line-through opacity-40 text-[12px] ml-1">
                ${originalPrice.toFixed(2)}
              </span>
            </>
          ) : (
            <span className="text-ink dark:text-paper">${originalPrice.toFixed(2)}</span>
          )}
        </div>
        <div className="label text-black/55 dark:text-paper/55 col-span-2 truncate">
          {product.category}
          {sizesDisplay ? ` · ${sizesDisplay}` : ""}
        </div>
      </div>
    </Link>
  );
};

export default CategoryProductCard;
