import { getClientProducts } from "@/app/services/getClientProducts";
import ProductPagination from "@/components/Products/ProductPagination";

export const dynamic = "force-dynamic";

async function Women() {
  const res = await getClientProducts("women");
  const products = res?.data?.data || [];

  return <ProductPagination initialProducts={products} />;
}

export default Women;
