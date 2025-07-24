"use client";

import { useEffect, useState, useContext } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { GlobalContext } from "@/context/index";
import { clearCart } from "@/services/clearCart";

const OrderSuccessContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthUser, user, setNavbarUpdateTrigger } = useContext(GlobalContext);
  const [sessionId, setSessionId] = useState("");
  const [cartCleared, setCartCleared] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    if (isAuthUser === false) {
      router.push("/login");
    }
  }, [isAuthUser, router]);

  useEffect(() => {
    const status = searchParams.get("status");
    const session = searchParams.get("session_id");

    if (status === "success" && session) {
      setSessionId(session);
      
      // Clear the cart after successful order
      if (user && !cartCleared) {
        const clearUserCart = async () => {
          try {
            const response = await clearCart(user._id);
            if (response.success) {
              setCartCleared(true);
              // Trigger navbar update to refresh cart count
              setNavbarUpdateTrigger(prev => !prev);
            }
          } catch (error) {
            console.error("Error clearing cart:", error);
          }
        };
        clearUserCart();
      }
    } else if (status === "cancel") {
      router.push("/checkout");
    } else {
      router.push("/");
    }
  }, [searchParams, router, user, cartCleared, setNavbarUpdateTrigger]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          {/* Success Icon */}
          <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-green-100 dark:bg-green-900 mb-6">
            <svg
              className="h-12 w-12 text-green-600 dark:text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Order Successful!
          </h1>
          
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
            Thank you for your purchase, {user?.name}!
          </p>
          
          <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">
            Your order has been confirmed and will be processed soon.
          </p>

          {sessionId && (
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Transaction ID:
              </p>
              <p className="text-xs font-mono text-gray-800 dark:text-gray-200 break-all">
                {sessionId}
              </p>
            </div>
          )}

          <div className="space-y-3">
            <Link
              href="/orders"
              className="block w-full bg-primary text-white rounded-lg py-3 px-4 font-semibold hover:bg-primary/90 transition-colors"
            >
              View My Orders
            </Link>
            
            <Link
              href="/products"
              className="block w-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg py-3 px-4 font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>

        <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
          A confirmation email has been sent to your registered email address.
        </p>
      </div>
    </div>
  );
};

export default OrderSuccessContent;