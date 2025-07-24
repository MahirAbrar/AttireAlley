"use client";
import React, { useState, useContext, useEffect } from "react";
import Image from "next/image";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "@/utils";
import {
  getStorage,
  uploadBytesResumable,
  ref,
  getDownloadURL,
} from "firebase/storage";
import { GlobalContext } from "@/context/index";
import { useRouter } from "next/navigation";
import { addNewProduct } from "@/services/addProduct";
import { toast } from "react-toastify";
import LoaderBig from "@/components/LoaderBig";
import Breadcrumbs from "@/components/Breadcrumbs";

// This is saved in the env.local file FIREBASE_STORAGE_URL=gs://next-js-ecomm-478a2.appspot.com how do i access it?
const firebaseStorageUrl = process.env.FIREBASE_STORAGE_URL;

const AddProduct = () => {
  const app = initializeApp(firebaseConfig);
  const storage = getStorage(app, firebaseStorageUrl);
  const [uploadedCount, setUploadedCount] = useState(0);

  const router = useRouter();

  const { componentLoader, setComponentLoader, isAuthUser, user } =
    useContext(GlobalContext);

  const [imageUploading, setImageUploading] = useState(false);
  const [formData, setFormData] = useState({
    user: "",
    name: "",
    description: "",
    price: 0,
    category: "Everyone",
    sizes: [],
    deliveryInfo: "",
    onSale: "No",
    imageURL: [],
    priceDrop: 0,
  });

  // Got user
  useEffect(() => {
    // Redirect if not authenticated or not an admin
    if (isAuthUser === false || user?.role !== "admin") {
      router.push("/");
    } else {
      setFormData(prevFormData => ({ ...prevFormData, user: user?._id }));
    }
  }, [isAuthUser, user, router]);

  async function handleImage(event) {
    setImageUploading(true);
    const files = event.target.files;
    const urls = [];
    let count = 0;

    for (const file of files) {
      try {
        const imageUrl = await imageUploadHelper(file);
        if (imageUrl) {
          urls.push(imageUrl);
          count++;
          setUploadedCount((prevCount) => prevCount + 1); // Increment the uploaded count
        }
      } catch (error) {
        toast.error("Failed to upload image: " + error.message);
      }
    }

    setFormData((prevFormData) => ({
      ...prevFormData,
      imageURL: [...prevFormData.imageURL, ...urls],
    }));

    setImageUploading(false);
    toast.success(
      `${count} ${
        count === 1 ? "image has" : "images have"
      } been uploaded successfully.`
    );
  }

  // Creates a unique file name.
  const createUniqueFileName = (getFile) => {
    const timeStamp = Date.now();
    const randomStringValue = Math.random().toString(36).substring(2, 12);
    return `${getFile.name}-${timeStamp}-${randomStringValue}`;
  };

  async function imageUploadHelper(file) {
    const getFileName = createUniqueFileName(file);
    const storageReference = ref(storage, `ecommerce/${getFileName}`);
    const uploadImage = uploadBytesResumable(storageReference, file);

    return new Promise((resolve, reject) => {
      uploadImage.on(
        "state_changed",
        () => {},
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadImage.snapshot.ref)
            .then((downloadUrl) => resolve(downloadUrl))
            .catch((error) => reject(error));
        }
      );
    });
  }

  const handleSizeClick = (size) => {
    if (formData.sizes.includes(size)) {
      setFormData({
        ...formData,
        sizes: formData.sizes.filter((s) => s !== size),
      });
    } else {
      setFormData({
        ...formData,
        sizes: [...formData.sizes, size],
      });
    }
  };

  async function handleAddProduct(e) {
    e.preventDefault();

    if (!formData.name || formData.name.length < 5) {
      toast.error("Name must be at least 5 characters long.");
      return; // Stop the function if validation fails
    } else if (!formData.sizes || formData.sizes.length === 0) {
      toast.error("Select at least 1 size.");
      return; // Stop the function if validation fails
    } else if (!formData.price) {
      toast.error("Price cannot be empty.");
      return; // Stop the function if validation fails
    } else {
      toast.dismiss(); // Clear validation message if check passes
    }

    // Set default values for description and deliveryInfo if they are empty
    const updatedFormData = {
      ...formData,
      description: formData.description || "No Description",
      deliveryInfo: formData.deliveryInfo || "No Delivery Info",
      price: Math.abs(formData.price),
      imageURL:
        formData.imageURL ||
        "https://firebasestorage.googleapis.com/v0/b/next-js-ecomm-478a2.appspot.com/o/ecommerce%2Fshubham-dhage-WtolM5hsj14-unsplash.jpg-1712814003553-j2jyl6tuw6?alt=media&token=4801feaf-bb51-4710-ac66-618c1630ab46",
    };

    setComponentLoader({ loading: true, id: "" });

    const res = await addNewProduct(updatedFormData);

    setComponentLoader({ loading: false, id: "" });
    if (res.success) {
      toast.success(res.message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
      });
      // set to default
      setFormData({
        user: user?._id || "",
        name: "",
        description: "",
        price: 0,
        category: "Everyone",
        sizes: [],
        deliveryInfo: "",
        onSale: "No",
        imageURL: [],
        priceDrop: 0,
      });
      setUploadedCount(0);

      // set timeout for 1.5 seconds
      setTimeout(() => {
        router.push("/admin-view/all-products");
      }, 1500);
    } else {
      toast.error(res.message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
      });
    }
  }
  if (!isAuthUser || user?.role !== "admin") {
    return (
      <div className="flex h-screen w-full items-center justify-center ">
        <LoaderBig />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="mx-auto max-w-6xl">
        <Breadcrumbs
          customPaths={{
            "/admin-view": "Admin Dashboard",
            "/admin-view/add-product": "Add Product",
          }}
        />

        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Add New Product</h1>
          <button
            onClick={() => router.push("/admin-view")}
            className="btn btn-outline"
          >
            Back to Dashboard
          </button>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Form Section */}
          <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
            <h2 className="mb-6 text-xl font-semibold">Product Details</h2>

            {/* Image Upload */}
            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium">
                Product Images
              </label>
              <input
                type="file"
                multiple
                className="file-input file-input-bordered w-full"
                accept="image/*"
                onChange={handleImage}
                disabled={imageUploading}
              />
              {imageUploading && (
                <p className="mt-2 text-sm text-primary">Uploading images...</p>
              )}
              {uploadedCount > 0 && (
                <p className="mt-2 text-sm text-success">
                  {uploadedCount} image{uploadedCount !== 1 ? "s" : ""} uploaded
                  successfully
                </p>
              )}
            </div>

            {/* Product Name */}
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter product name"
                className="input input-bordered w-full"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
              {formData.name && formData.name.length < 5 && (
                <p className="mt-1 text-sm text-error">
                  Name must be at least 5 characters
                </p>
              )}
            </div>
            {/* Price */}
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium">
                Price <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                placeholder="Enter price"
                className="input input-bordered w-full"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                min="0"
                step="0.01"
              />
            </div>
            {/* Description */}
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium">
                Description
              </label>
              <textarea
                placeholder="Enter product description"
                className="textarea textarea-bordered h-24 w-full"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
            {/* Category */}
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium">Category</label>
              <select
                className="select select-bordered w-full"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
              >
                <option value="Everyone">Everyone</option>
                <option value="Men">Men</option>
                <option value="Women">Women</option>
                <option value="Kids">Kids</option>
              </select>
            </div>
            {/* Available Sizes */}
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium">
                Available Sizes <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => handleSizeClick(size)}
                    className={`btn btn-sm ${
                      formData.sizes.includes(size)
                        ? "btn-primary"
                        : "btn-outline"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              {formData.sizes.length === 0 && (
                <p className="mt-1 text-sm text-error">
                  Please select at least one size
                </p>
              )}
            </div>
            {/* Delivery Info */}
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium">
                Delivery Info
              </label>
              <input
                type="text"
                placeholder="Enter delivery information"
                className="input input-bordered w-full"
                value={formData.deliveryInfo}
                onChange={(e) =>
                  setFormData({ ...formData, deliveryInfo: e.target.value })
                }
              />
            </div>
            {/* On Sale */}
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium">On Sale</label>
              <select
                className="select select-bordered w-full"
                value={formData.onSale}
                onChange={(e) =>
                  setFormData({ ...formData, onSale: e.target.value })
                }
              >
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </div>

            {/* Price Drop */}
            {formData.onSale === "Yes" && (
              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium">
                  Price Drop Amount
                </label>
                <input
                  type="number"
                  placeholder="Enter discount amount"
                  className="input input-bordered w-full"
                  value={formData.priceDrop}
                  onChange={(e) =>
                    setFormData({ ...formData, priceDrop: e.target.value })
                  }
                  min="0"
                  step="0.01"
                />
                {formData.price > 0 && formData.priceDrop > 0 && (
                  <p className="mt-1 text-sm text-info">
                    Sale Price: $
                    {(formData.price - formData.priceDrop).toFixed(2)}
                  </p>
                )}
              </div>
            )}

            {/* Submit Button */}
            <button
              className="btn btn-primary mt-6 w-full"
              onClick={handleAddProduct}
              disabled={imageUploading || componentLoader.loading}
            >
              {componentLoader.loading ? (
                <>
                  <span className="loading loading-spinner"></span>
                  Adding Product...
                </>
              ) : (
                "Add Product"
              )}
            </button>
          </div>

          {/* Preview Section */}
          <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
            <h2 className="mb-6 text-xl font-semibold">Preview</h2>

            {/* Image Preview */}
            {formData.imageURL.length > 0 ? (
              <div className="mb-6">
                <p className="mb-2 text-sm font-medium">Uploaded Images</p>
                <div className="grid grid-cols-2 gap-4">
                  {formData.imageURL.map((url, index) => (
                    <div key={index} className="group relative">
                      <Image
                        src={url}
                        alt={`Product ${index + 1}`}
                        width={160}
                        height={160}
                        className="h-40 w-full rounded-lg object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newUrls = formData.imageURL.filter(
                            (_, i) => i !== index
                          );
                          setFormData({ ...formData, imageURL: newUrls });
                          setUploadedCount(newUrls.length);
                        }}
                        className="btn btn-circle btn-error btn-sm absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mb-6 flex h-64 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700">
                <p className="text-gray-500">No images uploaded yet</p>
              </div>
            )}

            {/* Product Details Preview */}
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Product Name
                </p>
                <p className="font-semibold">{formData.name || "Not set"}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Price
                </p>
                <p className="font-semibold">
                  {formData.price ? `$${formData.price}` : "Not set"}
                  {formData.onSale === "Yes" && formData.priceDrop > 0 && (
                    <span className="ml-2 text-gray-500 line-through">
                      $
                      {(
                        parseFloat(formData.price) +
                        parseFloat(formData.priceDrop)
                      ).toFixed(2)}
                    </span>
                  )}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Category
                </p>
                <p className="font-semibold">{formData.category}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Available Sizes
                </p>
                <p className="font-semibold">
                  {formData.sizes.length > 0
                    ? formData.sizes.join(", ")
                    : "No sizes selected"}
                </p>
              </div>

              {formData.description && (
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Description
                  </p>
                  <p className="font-semibold">{formData.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
