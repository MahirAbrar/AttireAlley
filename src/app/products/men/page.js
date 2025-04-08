import { getClientProducts } from "@/services/getClientProducts";
import ProductPagination from "@/components/Products/ProductPagination";

export const dynamic = "force-dynamic";

export const generateStaticParams = async () => {
  return [];
};

// Remove "use client" since this will be a server component
export default async function Men() {
  const res = await getClientProducts("men");
  const products = res?.data?.data || [];

  return <ProductPagination initialProducts={products} />;
}
