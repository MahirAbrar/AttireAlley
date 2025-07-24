import { Suspense } from "react";
import OrderSuccessContent from "./OrderSuccessContent";
import Loader from "@/components/Loader";

const OrderSuccess = () => {
  return (
    <Suspense fallback={<Loader />}>
      <OrderSuccessContent />
    </Suspense>
  );
};

export default OrderSuccess;