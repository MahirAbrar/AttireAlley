"use client";

import { useContext, useEffect, useState, useRef } from "react";
import Link from "next/link";
import LoaderBig from "@/components/LoaderBig";
import Image from "next/image";
import { getClientProducts } from "@/services/getClientProducts";
import ClientCommonListing from "@/components/CommonListingClient";
import HoverText from "@/components/HoverText";
import NeonButton from "@/components/NeonButton";


export default function Home() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [pulseCircles, setPulseCircles] = useState([]);
  const scrollWrapperRef = useRef(null);

  useEffect(() => {
    fetchProducts();
    // Create initial pulse circles (reduced from 5 to 3)
    const initialCircles = Array.from({ length: 3 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 200 + 100,
      duration: Math.random() * 4 + 4,
      delay: Math.random() * 4
    }));
    setPulseCircles(initialCircles);

    // Create new pulse circles periodically (increased interval from 2000 to 3000)
    const interval = setInterval(() => {
      const newCircle = {
        id: Date.now(),
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: Math.random() * 200 + 100,
        duration: Math.random() * 4 + 4
      };
      setPulseCircles(prev => [...prev, newCircle]);

      // Remove the circle after animation completes
      setTimeout(() => {
        setPulseCircles(prev => prev.filter(circle => circle.id !== newCircle.id));
      }, newCircle.duration * 1000);
    }, 3000);

    return () => clearInterval(interval);
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


  return (
    <main className="w-full -mt-6">
      {/* First Section */}
      <div className="relative w-full h-screen overflow-hidden">
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat transition-transform duration-1000 ease-out"
          style={{
            backgroundImage: "url('/backgroundlanding.png')",
            maxWidth: "1920px",
            margin: "0 auto",
            left: "0",
            right: "0"
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
                &quot;Style is a way to say who you are without having to speak&quot;
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
        <div className="w-full h-screen bg-gray-300/50 dark:bg-backgroundDark/50 relative overflow-hidden backdrop-blur-sm">
          {/* Pulse Circles Background */}
          {pulseCircles.map(circle => (
            <div
              key={circle.id}
              className="pulse-circle"
              style={{
                left: `${circle.left}%`,
                top: `${circle.top}%`,
                width: `${circle.size}px`,
                height: `${circle.size}px`,
                animationDuration: `${circle.duration}s`,
                animationDelay: `${circle.delay || 0}s`
              }}
            />
          ))}
          <div className="w-full h-full flex flex-col justify-center px-4 relative z-20">
            {/* Image Accordion */}
            <div className="flex flex-col md:flex-row h-[40vh] gap-8 mb-12 items-center justify-center">
              {/* Army Collection */}
              <div className="group relative w-80 h-80 md:w-96 md:h-96 transition-all duration-500 hover:w-[28rem] hover:h-[28rem]">
                <div className="absolute inset-0 rounded-full overflow-hidden shadow-2xl shadow-black/50 dark:shadow-white/20 glass-container">
                  <Image
                    src="/landingpage/seconddiv1.jpg"
                    alt="Army Girl"
                    width={500}
                    height={500}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="absolute bottom-[-1.5rem] left-0 w-full h-1 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left shadow-[0_0_10px_rgba(0,0,0,0.3)] dark:shadow-[0_0_10px_rgba(255,255,255,0.3)]"></div>
              </div>
              {/* Third Collection */}
              <div className="group relative w-80 h-80 md:w-96 md:h-96 transition-all duration-500 hover:w-[28rem] hover:h-[28rem]">
                <div className="absolute inset-0 rounded-full overflow-hidden shadow-2xl shadow-black/50 dark:shadow-white/20 glass-container">
                  <Image
                    src="/landingpage/seconddiv2.jpg"
                    alt="Third Collection"
                    width={500}
                    height={500}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="absolute bottom-[-1.5rem] left-0 w-full h-1 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left shadow-[0_0_10px_rgba(0,0,0,0.3)] dark:shadow-[0_0_10px_rgba(255,255,255,0.3)]"></div>
              </div>
              {/* Grok Collection */}
              <div className="group relative w-80 h-80 md:w-96 md:h-96 transition-all duration-500 hover:w-[28rem] hover:h-[28rem]">
                <div className="absolute inset-0 rounded-full overflow-hidden shadow-2xl shadow-black/50 dark:shadow-white/20 glass-container">
                  <Image
                    src="/landingpage/seconddiv3.jpg"
                    alt="Grok Collection"
                    width={500}
                    height={500}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="absolute bottom-[-1.5rem] left-0 w-full h-1 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left shadow-[0_0_10px_rgba(0,0,0,0.3)] dark:shadow-[0_0_10px_rgba(255,255,255,0.3)]"></div>
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
                <NeonButton color="#00adb5" className="text-lg md:text-xl">
                  Explore Collections
                </NeonButton>
              </Link>
            </div>
          </div>
        </div>

{/* divider 2 */}
      <div
        className="h-1 w-full bg-gradient-to-r from-accent via-secondary to-primary dark:from-accentDark dark:via-secondaryDark dark:to-primaryDark"
      ></div>

{/* Third Section */}
      <section
        className="w-full bg-gray-100 bg-opacity-95 pt-4 dark:bg-backgroundDark dark:bg-opacity-95"
      >
        <div className="text-center ">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 drop-shadow-lg text-primary">
            Most Popular Sales
          </h1>
        </div>

        {/* Horizontal Scroll Gallery */}
        <div className="relative h-screen w-full overflow-hidden">
          <div className="horizontal-scroll-wrapper w-full">
            {products?.slice(0, 10).map((product, index) => (
              <div 
                key={product._id} 
                className={`img-wrapper ${index % 3 === 0 ? 'slower' : index % 3 === 1 ? 'faster' : 'vertical'}`}
              >
                <Link href={`/products/${product._id}`}>
                  <div className="overflow-hidden rounded-lg shadow-lg">
                    <Image
                      src={product.imageURL[0]}
                      alt={product.name}
                      width={500}
                      height={500}
                      className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-40 opacity-0 transition-opacity duration-300 hover:opacity-100">
                      <h3 className="mb-2 text-xl font-bold text-white">
                        {product.name}
                      </h3>
                      <p className="text-white">
                        {product.onSale === "Yes" 
                          ? `${product.price - product.priceDrop} AUD`
                          : `${product.price} AUD`}
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
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
                  <Image
                    src={collection.imageSrc}
                    alt={collection.altText}
                    width={500}
                    height={300}
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
                <Image
                  src={collections[2].imageSrc}
                  alt={collections[2].altText}
                  width={500}
                  height={620}
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
