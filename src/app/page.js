"use client";

import { useContext, useEffect, useRef, useState } from "react";
import { GlobalContext } from "@/context/index";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LoaderBig from "@/components/LoaderBig";
import Image from "next/image";
import { getClientProducts } from "@/services/getClientProducts";
import ClientCommonListing from "@/components/CommonListingClient";

gsap.registerPlugin(ScrollTrigger);

const PRODUCTS_PER_PAGE = 5;

export default function Home() {
  const { isAuthUser, user } = useContext(GlobalContext);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

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

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await getClientProducts("all");
    if (res?.data?.data) {
      console.log("Product data:", res.data.data);
      setProducts(res.data.data);
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  const divider1Ref = useRef(null);
  const divider2Ref = useRef(null);
  const section1Ref = useRef(null);
  const section2Ref = useRef(null);
  const section3Ref = useRef(null);

  useEffect(() => {
    // Function to set up animations for a single element
    const setupAnimation = (element, animationProps) => {
      gsap.fromTo(
        element,
        { opacity: 0, ...animationProps.from },
        {
          opacity: 1,
          ...animationProps.to,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: element,
            start: "top bottom-=100",
            toggleActions: "play none none reverse",
          },
        },
      );
    };

    // Set up animations for dividers
    setupAnimation(divider1Ref.current, {
      from: { scaleX: 0, transformOrigin: "left" },
      to: { scaleX: 1 },
    });

    setupAnimation(divider2Ref.current, {
      from: { scaleX: 0, transformOrigin: "right" },
      to: { scaleX: 1 },
    });

    // Set up animations for sections
    [section1Ref, section2Ref, section3Ref].forEach((ref) => {
      setupAnimation(ref.current, {
        from: { y: 50 },
        to: { y: 0 },
      });
    });
  }, [divider1Ref, divider2Ref, section1Ref, section2Ref, section3Ref]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background dark:bg-backgroundDark">
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
    <main className="flex flex-col items-center">
      {/* Hero Section */}
      <div
        ref={section1Ref}
        className="w-full bg-background bg-opacity-100 py-8 dark:bg-backgroundDark dark:bg-opacity-100"
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center md:flex-row md:justify-between">
            <div className="md:w-2/5 md:pr-8 lg:w-1/3">
              <h1 className="mb-4 text-4xl font-bold text-primary">
                Shop all our collection!
              </h1>
              <p className="mb-6 text-lg">
                {isAuthUser
                  ? `Welcome back, ${user.name}! `
                  : "Welcome to Attire Alley! "}
                Shop our best collection of clothes, made with the best
                materials and sold at the cheapest cost!
              </p>
              <Link href="/products" passHref>
                <button className="hover:bg-accent-dark rounded bg-accent px-4 py-2 font-bold text-white transition-colors duration-300">
                  Shop All Collection
                </button>
              </Link>
            </div>
            <div className="mt-8 md:mt-0 md:w-3/5 lg:w-2/3">
              <Image
                src="https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=1771&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Collection Preview"
                width={1771}
                height={1000}
                className="rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Collections Section */}
      <div ref={section2Ref} className="w-full py-12">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-center text-3xl font-bold text-primary">
            Our Collections
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {collections.map((collection) => (
              <Link
                key={collection.title}
                href={collection.linkHref}
                className="group relative overflow-hidden rounded-lg"
              >
                <Image
                  src={collection.imageSrc}
                  alt={collection.altText}
                  width={600}
                  height={400}
                  className="transform transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
                  <h3 className="text-2xl font-bold text-white">
                    {collection.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Products Section */}
      <div ref={section3Ref} className="w-full py-12">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-center text-3xl font-bold text-primary">
            Featured Products
          </h2>
          
          {/* Pagination */}
          <div className="join mb-8">
            {Array.from({ length: numberOfPages }, (_, index) => (
              <button
                key={index}
                className={`btn join-item ${
                  index + 1 === currentPage ? "btn-active" : ""
                }`}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            {currentProducts.length > 0 ? (
              currentProducts.map((product) => (
                <ClientCommonListing key={product._id} product={product} />
              ))
            ) : (
              <div className="flex items-center justify-center">
                <div className="rounded-lg bg-gray-100 p-8 text-center shadow-md dark:bg-gray-800">
                  <h1 className="mb-2 text-2xl font-bold text-primary dark:text-primaryDark">
                    No products found
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300">
                    Try adjusting your search or filter criteria.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
