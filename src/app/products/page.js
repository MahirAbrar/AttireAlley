import { getClientProducts } from "@/app/services/getClientProducts";
import ProductPagination from "@/components/Products/ProductPagination";

export const dynamic = "force-dynamic";

async function getProducts() {
  const res = await getClientProducts("all");
  if (!res?.data?.data) {
    throw new Error("Failed to fetch products");
  }
  return res.data.data;
}

export default async function Products() {
  const products = await getProducts();

  return (
    <div>
      <ProductPagination initialProducts={products} />
    </div>
  );
}
