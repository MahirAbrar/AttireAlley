import { getClientProducts } from "@/app/services/getClientProducts";
import ProductPagination from "@/components/Products/ProductPagination";

// Remove "use client" since this will be a server component
async function Men() {
  const res = await getClientProducts("men");
  const products = res?.data?.data || [];

  return <ProductPagination initialProducts={products} />;
}

export default Men;
