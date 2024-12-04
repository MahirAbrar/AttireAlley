import connectToDB from "@/app/database";
import AuthUser from "@/middleware/AuthUser";
import Order from "@/app/models/order";
import User from "@/app/models/user";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    await connectToDB();
    const isAuthUser = await AuthUser(req);

    if (isAuthUser) {
      const data = await req.json();
      const { user } = data;

      const saveNewOrder = await Order.create({
        user: data.user,
        orderItems: data.orderItems,
        shippingAddress: data.shippingAddress,
        paymentMethod: data.paymentMethod || "Stripe",
        totalPrice: data.totalPrice,
        isPaid: false,
        isProcessing: true,
      });

      if (saveNewOrder) {
        // Clear the user's cart after order creation
        const updatedUser = await User.findByIdAndUpdate(
          user,
          { $set: { cart: [] } },
          { new: true },
        );

        if (!updatedUser) {
          return NextResponse.json({
            success: false,
            message: "Failed to clear cart after order creation",
          });
        }

        return NextResponse.json({
          success: true,
          message: "Products are on the way!",
        });
      } else {
        return NextResponse.json({
          success: false,
          message: "Failed to create an order! Please try again",
        });
      }
    } else {
      return NextResponse.json({
        success: false,
        message: "You are not authenticated",
      });
    }
  } catch (e) {
    console.error("Order creation error:", e);
    return NextResponse.json({
      success: false,
      message: "Something went wrong! Please try again later",
    });
  }
}
