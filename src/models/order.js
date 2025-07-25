import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderItems: [
      {
        quantity: {
          type: Number,
          required: true,
        },
        productID: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Products",
          required: true,
        },
      },
    ],
    shippingAddress: {
      fullName: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      country: { type: String, required: true },
      postalCode: { type: String, required: true },
      additionalDetails: { type: String },
    },
    paymentMethod: {
      type: String,
      required: true,
      default: "Stripe",
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    isProcessing: {
      type: Boolean,
      required: true,
      default: true,
    },
    orderStatus: {
      type: String,
      required: true,
      default: "pending",
      enum: ["pending", "paid", "confirmed", "processing", "shipped", "delivered", "cancelled"],
    },
    statusHistory: [{
      status: {
        type: String,
        required: true,
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
      note: {
        type: String,
      },
    }],
    trackingNumber: {
      type: String,
    },
    stripeSessionId: {
      type: String,
      sparse: true,
    },
  },
  { timestamps: true },
);

const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);

export default Order;
