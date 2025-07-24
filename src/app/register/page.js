"use client";

import React, { useEffect, useContext, useRef } from "react";
import { GlobalContext } from "@/context/index";
import RegisterForm from "./registerForm";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";

const isRegistered = false;

const Register = () => {
  const { isAuthUser } = useContext(GlobalContext);
  const router = useRouter();
  const rightSideRef = useRef(null);

  useEffect(() => {
    if (isAuthUser) {
      router.push("/");
    }
  }, [isAuthUser, router]);

  useEffect(() => {
    // GSAP animations
    const ctx = gsap.context(() => {
      // Animate left side form
      gsap.fromTo(
        ".form-container",
        { opacity: 0, x: -30 },
        { opacity: 1, x: 0, duration: 0.8, ease: "power3.out" }
      );

      // Animate form elements
      gsap.fromTo(
        ".form-element",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out",
          delay: 0.3,
        }
      );

      // Animate right side
      gsap.fromTo(
        rightSideRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1, ease: "power3.out" }
      );

      // Animate floating elements
      if (rightSideRef.current) {
        // Background blobs
        gsap.to(".float-element-1", {
          x: 30,
          y: -30,
          duration: 20,
          repeat: -1,
          yoyo: true,
          ease: "none",
        });

        gsap.to(".float-element-2", {
          x: -30,
          y: 30,
          duration: 15,
          repeat: -1,
          yoyo: true,
          ease: "none",
        });

        // Animate welcome text
        gsap.fromTo(
          ".welcome-text",
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 1, ease: "power3.out", delay: 0.5 }
        );

        // Animate feature cards
        gsap.fromTo(
          ".feature-card",
          { opacity: 0, scale: 0.9 },
          { 
            opacity: 1, 
            scale: 1, 
            duration: 0.6, 
            stagger: 0.2, 
            ease: "power3.out", 
            delay: 0.8 
          }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Form Section */}
      <div className="form-container flex w-full flex-col justify-center px-8 py-12 lg:w-1/2 lg:px-12 xl:px-24">
        <div className="mx-auto w-full max-w-md">
          {/* Logo */}
          <div className="form-element mb-8">
            <h1 className="text-3xl font-bold text-primary">AttireAlley</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Create your account and start shopping!
            </p>
          </div>

          {/* Form */}
          {!isRegistered ? (
            <RegisterForm />
          ) : (
            <div className="form-element text-center">
              <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                Already Registered!
              </h1>
              <button 
                onClick={() => router.push("/")}
                className="mt-4 rounded-lg bg-primary px-6 py-3 font-semibold text-white transition hover:bg-primary/90">
                Go to Shop
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Right Side - Image/Gradient Section */}
      <div 
        ref={rightSideRef}
        className="relative hidden lg:flex lg:w-1/2 lg:items-center lg:justify-center overflow-hidden"
      >
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-primary/80"></div>
        
        {/* Pattern Overlay */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.133 7-7s-3.134-7-7-7-7 3.133-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.133 7-7s-3.134-7-7-7-7 3.133-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          }}
        />
        
        {/* Content */}
        <div className="relative z-10 flex h-full w-full items-center justify-center px-12">
          <div className="max-w-lg">
            {/* Welcome Message */}
            <div className="welcome-text mb-12 text-center">
              <h2 className="mb-4 text-5xl font-bold text-white">Join AttireAlley</h2>
              <p className="text-xl text-white/90">Discover your perfect style</p>
            </div>
            
            {/* Feature Cards */}
            <div className="space-y-4">
              <div className="feature-card rounded-2xl bg-white/10 backdrop-blur-sm p-6 border border-white/20">
                <div className="flex items-center space-x-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
                    <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Fast & Free Shipping</h3>
                    <p className="text-sm text-white/70">On orders over $50</p>
                  </div>
                </div>
              </div>
              
              <div className="feature-card rounded-2xl bg-white/10 backdrop-blur-sm p-6 border border-white/20">
                <div className="flex items-center space-x-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
                    <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Secure Shopping</h3>
                    <p className="text-sm text-white/70">100% protected payments</p>
                  </div>
                </div>
              </div>
              
              <div className="feature-card rounded-2xl bg-white/10 backdrop-blur-sm p-6 border border-white/20">
                <div className="flex items-center space-x-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
                    <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Easy Returns</h3>
                    <p className="text-sm text-white/70">30-day return policy</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="float-element-1 absolute bottom-0 left-0 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="float-element-2 absolute right-0 top-0 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
      </div>
    </div>
  );
};

export default Register;
