"use client";

import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "@/context/index";
import Link from "next/link";
import LoaderBig from "@/components/LoaderBig";
import Image from "next/image";
import { getClientProducts } from "@/services/getClientProducts";
import ClientCommonListing from "@/components/CommonListingClient";
import HoverText from "@/components/HoverText";

const PRODUCTS_PER_PAGE = 5;

export default function Home() {
  const { isAuthUser, user } = useContext(GlobalContext);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchProducts();
  }, []);

  const collections = [
    {
      imageSrc:
        "https://images.unsplash.com/photo-1625657332021-9b714782dde0?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      altText: "Kids Collection",
      title: "Kids",
      linkHref: "/products/kids",
    },
    {
      imageSrc:
        "https://images.unsplash.com/photo-1698815614885-97a1b2d29669?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      altText: "Womens Collection",
      title: "Women",
      linkHref: "/products/women",
    },
    {
      imageSrc:
        "https://images.unsplash.com/photo-1558541983-39b080b84d16?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      altText: "Mens Collection",
      title: "Mens",
      linkHref: "/products/men",
    },
  ];

  const fetchProducts = async () => {
    console.log("Fetching products");
    const res = await getClientProducts("all");
    console.log("Products fetched");
    if (res?.data?.data) {
      console.log("Product data:", res.data.data);
      setProducts(res.data.data);
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <LoaderBig />
      </div>
    );
  }

  const indexOfLastProduct = currentPage * PRODUCTS_PER_PAGE;
  const indexOfFirstProduct = indexOfLastProduct - PRODUCTS_PER_PAGE;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct,
  );

  const numberOfPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <main className="w-full -mt-6">
      {/* First Section */}
      <div className="relative w-full h-[94vh] overflow-hidden">
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat transition-transform duration-1000 ease-out"
          style={{
            backgroundImage: "url('/backgroundlanding.png')"
          }}
        />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
        <div className="relative z-10 h-full flex items-center justify-center px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div 
              onMouseEnter={() => {
                const bg = document.querySelector('.bg-cover');
                if (bg) bg.style.transform = 'scale(1.03)';
              }}
              onMouseLeave={() => {
                const bg = document.querySelector('.bg-cover');
                if (bg) bg.style.transform = 'scale(1)';
              }}
            >
              <h1 className="text-5xl md:text-7xl font-bold mb-6 drop-shadow-lg text-white">
                "Style is a way to say who you are without having to speak"
              </h1>
              <p className="text-xl md:text-2xl drop-shadow-md text-white/90">
                At Attire Alley, we believe in making fashion speak volumes about your unique personality
              </p>
            </div>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2">
          <p className="text-white text-lg drop-shadow-md">Scroll down to explore</p>
          <div className="animate-bounce">
            <svg
              className="w-6 h-6 text-white drop-shadow-md"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </div>
      </div>

{/* Divider */}
      <div className="h-1 w-full bg-gradient-to-r dark:from-primary dark:via-secondary dark:to-accent from-secondary  to-accent"></div>

  {/* 2nd section */}
        <div className="w-full h-screen bg-gray-300 bg-opacity-100 dark:bg-backgroundDark dark:bg-opacity-100">
          <div className="w-full h-full flex flex-col justify-center px-4">
            {/* Image Accordion */}
            <div className="flex flex-col md:flex-row h-[40vh] gap-8 mb-12 items-center justify-center">
              {/* Army Collection */}
              <div className="group relative w-80 h-80 md:w-96 md:h-96 transition-all duration-500 hover:w-[28rem] hover:h-[28rem]">
                <div className="absolute inset-0 rounded-full overflow-hidden shadow-2xl shadow-black/50 dark:shadow-white/20">
                  <img
                    src="landingpage\seconddiv1-Photoroom.png"
                    alt="Army Collection"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="absolute bottom-[-1.5rem] left-0 w-full h-1 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              </div>
              {/* Third Collection */}
              <div className="group relative w-80 h-80 md:w-96 md:h-96 transition-all duration-500 hover:w-[28rem] hover:h-[28rem]">
                <div className="absolute inset-0 rounded-full overflow-hidden shadow-2xl shadow-black/50 dark:shadow-white/20">
                  <img
                    src="landingpage\seconddiv2-Photoroom.png"
                    alt="Third Collection"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="absolute bottom-[-1.5rem] left-0 w-full h-1 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              </div>
              {/* Grok Collection */}
              <div className="group relative w-80 h-80 md:w-96 md:h-96 transition-all duration-500 hover:w-[28rem] hover:h-[28rem]">
                <div className="absolute inset-0 rounded-full overflow-hidden shadow-2xl shadow-black/50 dark:shadow-white/20">
                  <img
                    src="landingpage\seconddiv3-Photoroom.png"
                    alt="Grok Collection"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="absolute bottom-[-1.5rem] left-0 w-full h-1 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              </div>
            </div>

            {/* Main Heading */}
            <div className="text-center mb-12">
              <HoverText text="Elevate Your Style" className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-primary mb-4" />
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Discover collections that speak to your unique style and personality
              </p>
            </div>

            {/* Welcome Section */}
            <div className="text-center max-w-4xl mx-auto">
              <Link href="/products" passHref>
                <button className="hover:bg-accent-dark rounded-lg bg-accent px-8 py-4 font-bold text-white transition-colors duration-300 text-lg md:text-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                  Explore Collections
                </button>
              </Link>
            </div>
          </div>
        </div>

{/* divider 2 */}
      <div
        className="h-1 w-full bg-gradient-to-r from-accent via-secondary to-primary dark:from-accentDark dark:via-secondaryDark dark:to-primaryDark"
      ></div>

      <section
        className="w-full bg-background bg-opacity-95 py-8 dark:bg-backgroundDark dark:bg-opacity-95"
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between md:flex-row">
            <div className="mb-6 md:mb-0 md:w-1/3">
              <h1 className="mb-4 text-4xl font-bold text-primary">
                Most popular sales
              </h1>
              <Link href="/products" passHref>
                <button className="hover:bg-accent-dark rounded bg-accent px-4 py-2 font-bold text-white transition-colors duration-300">
                  Shop All
                </button>
              </Link>
            </div>
            {products?.length > 0 && (
              <div className="grid grid-cols-1 gap-4 md:w-2/3 md:grid-cols-2">
                {/* Popular Item 1 */}
                <div className="group relative overflow-hidden rounded-lg bg-white shadow-md dark:bg-gray-800">
                  <img
                    src={products[19].imageURL[0]}
                    alt="Popular Item 1"
                    className="h-96 w-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <h3 className="mb-2 text-xl font-bold text-white">
                      {products[19].name}
                    </h3>
                    <Link href={`/products/${products[19]._id}`} passHref>
                      <button className="rounded bg-white px-4 py-2 text-black transition-colors duration-300 hover:bg-gray-200">
                        Check Details
                      </button>
                    </Link>
                  </div>
                  <div className="p-4">
                    <h2 className="mb-2 text-lg font-semibold">
                      {products[19].name}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300">
                      {products[19].price - products[19].priceDrop} AUD
                    </p>
                  </div>
                </div>
                {/* Popular Item 2 */}
                <div className="group relative overflow-hidden rounded-lg bg-white shadow-md dark:bg-gray-800">
                  <img
                    src={products[15].imageURL[0]}
                    alt="Popular Item 2"
                    className="h-96 w-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <h3 className="mb-2 text-xl font-bold text-white">
                      {products[15].name}
                    </h3>
                    <Link href={`/products/${products[15]._id}`} passHref>
                      <button className="rounded bg-white px-4 py-2 text-black transition-colors duration-300 hover:bg-gray-200">
                        Check Details
                      </button>
                    </Link>
                  </div>
                  <div className="p-4">
                    <h2 className="mb-2 text-lg font-semibold">
                      {products[15].name}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300">
                      {products[15].price - products[15].priceDrop} AUD
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <div
        className="h-1 w-full bg-gradient-to-r from-accent via-secondary to-primary dark:from-accentDark dark:via-secondaryDark dark:to-primaryDark"
      ></div>

      <section
        className="w-full bg-background bg-opacity-90 py-8 dark:bg-backgroundDark dark:bg-opacity-90"
      >
        <div className="container mx-auto px-4">
          <h1 className="mb-4 text-center text-4xl font-bold text-primary">
            Check out our different collections
          </h1>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="grid grid-rows-2 gap-4">
              {collections.slice(0, 2).map((collection, index) => (
                <div
                  key={index}
                  className="aspect-w-16 aspect-h-9 group relative overflow-hidden"
                >
                  <img
                    src={collection.imageSrc}
                    alt={collection.altText}
                    className="h-full max-h-[300px] w-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <h3 className="mb-2 text-xl font-bold text-white">
                      {collection.title}
                    </h3>
                    <Link href={collection.linkHref} passHref>
                      <button className="rounded bg-white px-4 py-2 text-black transition-colors duration-300 hover:bg-gray-200">
                        Shop Now
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            <div className="aspect-w-9 aspect-h-16 md:aspect-h-20">
              <div className="group relative h-full overflow-hidden">
                <img
                  src={collections[2].imageSrc}
                  alt={collections[2].altText}
                  className="h-full max-h-[620px] w-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <h3 className="mb-2 text-xl font-bold text-white">
                    {collections[2].title}
                  </h3>
                  <Link href={collections[2].linkHref} passHref>
                    <button className="rounded bg-white px-4 py-2 text-black transition-colors duration-300 hover:bg-gray-200">
                      Shop Now
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
