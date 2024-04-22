import connectToDB from "@/app/database";
import Product from "@/app/models/products";
import AuthUser from "@/middleware/AuthUser";
import { NextResponse } from "next/server";

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    return NextResponse.json(
      {
        success: false,
        message: "Method not allowed",
      },
      { status: 405 },
    );
  }

  try {
    await connectToDB();

    const { id } = req.query;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Product ID is required",
        },
        { status: 400 },
      );
    }

    const isAuthUser = await AuthUser(req);

    // Authentication and authorization logic here
    if (isAuthUser.role === "admin") {
      const deletedProduct = await Product.findByIdAndDelete(id);

      if (!deletedProduct) {
        return NextResponse.json(
          {
            success: false,
            message: "Product not found",
          },
          { status: 404 },
        );
      }

      // If the deletion was successful
      return NextResponse.json(
        {
          success: true,
          message: "Product deleted successfully",
          data: deletedProduct, // Optionally return the deleted product's data
        },
        { status: 200 },
      );
    } else {
      // If the user is not recognized as an admin
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 },
      );
    }
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to connect to database or delete product" + error.message,
      },
      { status: 500 },
    );
  }
}
