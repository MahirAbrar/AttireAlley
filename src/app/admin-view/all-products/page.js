"use client";
import { useEffect, useState, useContext } from "react";
import AdminCommonListing from "@/components/CommonListingAdmin";
import { getProducts } from "@/services/getProducts";
import { useRouter } from "next/navigation";
import LoaderBig from "@/components/LoaderBig";
import { GlobalContext } from "@/context/index";
import { deleteProduct } from "@/services/deleteProduct";
import ConfirmationModal from "@/components/ConfirmationModal";
import Breadcrumbs from "@/components/Breadcrumbs";
import { toast } from "react-toastify";

const AllProducts = () => {
  const router = useRouter();
  const { isAuthUser, user } = useContext(GlobalContext);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    productId: null,
    productName: "",
  });
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    // Check for user authentication and admin role
    if (isAuthUser !== null) {
      if (!isAuthUser || user?.role !== "admin") {
        // If not authenticated or not an admin, redirect
        router.push("/some-other-route");
        return; // Exit early to prevent further execution
      } else {
        fetchProducts(); // Now call fetchProducts within this condition
      }
    }
  }, [isAuthUser, user, router]);

  const fetchProducts = async () => {
    const res = await getProducts();
    if (res?.data?.data) {
      setProducts(res.data.data);
    } else {
      // Handle error or empty data case
      console.error("Failed to fetch products or data is empty.");
    }
    setLoading(false); // Authenticated as admin, proceed to fetch products
  };

  const handleDeleteClick = (product) => {
    setDeleteModal({
      isOpen: true,
      productId: product._id,
      productName: product.name,
    });
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      const response = await deleteProduct(deleteModal.productId, user._id);
      if (response.success) {
        toast.success("Product deleted successfully");
        fetchProducts(); // Refresh the products list
        setDeleteModal({ isOpen: false, productId: null, productName: "" });
      } else {
        toast.error(response.message || "Failed to delete product");
      }
    } catch (error) {
      toast.error("An error occurred while deleting the product");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, productId: null, productName: "" });
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background dark:bg-backgroundDark">
        <LoaderBig />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <Breadcrumbs 
          customPaths={{
            "/admin-view": "Admin Dashboard",
            "/admin-view/all-products": "Manage Products"
          }}
        />
        
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Manage Products</h1>
          <div className="flex gap-2">
            <button 
              onClick={() => router.push('/admin-view/add-product')}
              className="btn btn-primary"
            >
              Add New Product
            </button>
            <button 
              onClick={() => router.push('/admin-view')}
              className="btn btn-outline"
            >
              Back to Dashboard
            </button>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
              No products found
            </p>
            <button 
              onClick={() => router.push('/admin-view/add-product')}
              className="btn btn-primary"
            >
              Add Your First Product
            </button>
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-4">
            {products.map((product) => (
              <AdminCommonListing
                key={product._id}
                user={product}
                onDelete={() => handleDeleteClick(product)}
              />
            ))}
          </div>
        )}

        <ConfirmationModal
          isOpen={deleteModal.isOpen}
          onClose={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
          title="Delete Product"
          message={`Are you sure you want to delete "${deleteModal.productName}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          confirmButtonClass="btn-error"
          isLoading={isDeleting}
        />
      </div>
    </div>
  );
};

export default AllProducts;
