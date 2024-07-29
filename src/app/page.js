"use client";

import { useContext } from "react";
import { GlobalContext } from "@/context/index";
import Link from "next/link";

export default function Home() {
  const { isAuthUser, user } = useContext(GlobalContext);

  console.log(user);
  const collections = [
    {
      imageSrc:
        "https://images.unsplash.com/photo-1625657332021-9b714782dde0?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      altText: "Kids Collection",
      title: "Kids",
      linkHref: "/collections/summer",
    },
    {
      imageSrc:
        "https://images.unsplash.com/photo-1698815614885-97a1b2d29669?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      altText: "Womens Collection",
      title: "Women",
      linkHref: "/collections/winter",
    },
    {
      imageSrc:
        "https://images.unsplash.com/photo-1558541983-39b080b84d16?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      altText: "Mens Collection",
      title: "Mens",
      linkHref: "/collections/new-arrivals",
    },
  ];

  return (
    <main className="flex min-h-screen flex-col items-center  bg-background text-text dark:bg-backgroundDark dark:text-textDark">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center md:flex-row">
          <div className="md:w-1/2 md:pr-8">
            <h1 className="mb-4 text-4xl font-bold text-primary">
              Shop all our collection!
            </h1>
            <p className="mb-6 text-lg">
              {isAuthUser
                ? `Welcome back, ${user.name}! `
                : "Welcome to Attire Alley! "}
              Shop our best collection of clothes, made with the best materials
              and sold at the cheapest cost!
            </p>
            <Link href="/products" passHref>
              <button className="hover:bg-accent-dark rounded bg-accent px-4 py-2 font-bold text-white">
                Shop All Collection
              </button>
            </Link>
          </div>
          <div className="mt-8 md:mt-0 md:w-1/2">
            <img
              src="https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=1771&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Collection Preview"
              className="h-auto w-full rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>
      <div>
        <h1 className="mb-4 text-4xl font-bold text-primary">
          Shop our most popular collection
        </h1>
      </div>
      <div>
        <h1 className="mb-4 text-4xl font-bold text-primary">
          Check out our different colletions
        </h1>
        <div className="container mx-auto max-h-[450px] px-4 py-8">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="grid grid-rows-2 gap-4">
              {collections.slice(0, 2).map((collection, index) => (
                <div key={index} className="group relative overflow-hidden">
                  <img
                    src={collection.imageSrc}
                    alt={collection.altText}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
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
            <div className="row-span-2">
              <div className="group relative h-full overflow-hidden">
                <img
                  src={collections[2].imageSrc}
                  alt={collections[2].altText}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
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
      </div>
    </main>
  );
}
