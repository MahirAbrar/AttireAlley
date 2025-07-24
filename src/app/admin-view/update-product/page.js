"use client";
import React, { useState, useContext } from "react";
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
import Loader from "@/components/Loader";
import { updateProduct } from "@/services/updateProduct";
import { toast } from "react-toastify";
import LoaderBig from "@/components/LoaderBig";

const firebaseStorageUrl = process.env.FIREBASE_STORAGE_URL;

const UpdateProduct = () => {
  const app = initializeApp(firebaseConfig);
  const storage = getStorage(app, firebaseStorageUrl);

  const router = useRouter();
  const {
    componentLoader,
    setComponentLoader,
    isAuthUser,
    user,
    updateItem,
  } = useContext(GlobalContext);

  const [imageUploading, setImageUploading] = useState(false);

  const [formData, setFormData] = useState({
    user: updateItem?.user || "",
    name: updateItem?.name || "",
    price: updateItem?.price || "",
    description: updateItem?.description || "",
    category: updateItem?.category || "",
    deliveryInfo: updateItem?.deliveryInfo || "",
    onSale: updateItem?.onSale || "",
    priceDrop: updateItem?.priceDrop || "",
    sizes: updateItem?.sizes || [],
    imageURL: updateItem?.imageURL || "",
  });

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

  async function handleImage(event) {
    setImageUploading(true);
    const extractImageUrl = await imageUploadHelper(event.target.files[0]);
    if (extractImageUrl) {
      setFormData({ ...formData, imageURL: extractImageUrl });
      toast.success("Image uploaded successfully.");
    }
    setImageUploading(false);
  }

  const createUniqueFileName = (getFile) => {
    const timeStamp = Date.now();
    const randomStringValue = Math.random().toString(36).substring(2, 12);
    return `${getFile.name}-${timeStamp}-${randomStringValue}`;
  };

  async function imageUploadHelper(file) {
    const getFileName = createUniqueFileName(file);

    // Create a storage reference from our storage service. ref(getStorage(app, {firebaseStorageURL}), {folder location})
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
        },
      );
    });
  }

  const productId = updateItem?._id;
  if (!updateItem) {
    return <div>Nothing to update</div>;
  }

  async function handleUpdateProduct(e) {
    e.preventDefault();
    // Validation checks

    if (!formData.name || formData.name.length < 5) {
      toast.error("Name must be at least 5 characters long.");
      return;
    }

    setComponentLoader({ loading: true, id: "" });

    try {
      const res = await updateProduct(productId, formData); // Pass productId and updated formData
      if (res.success) {
        toast.success("Product updated successfully!");
        router.push("/admin-view/all-products");
      } else {
        throw new Error(res.message || "Failed to update the product.");
      }
    } catch (error) {
      toast.error(error.message || "An error occurred.");
    } finally {
      setComponentLoader({ loading: false, id: "" });
    }
  }

  if (!isAuthUser || user?.role !== "admin") {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background dark:bg-backgroundDark">
        <LoaderBig />
      </div>
    );
  }

  return (
    <div className="card w-full max-w-sm shrink-0 bg-base-100 p-4 shadow-2xl">
      <label>
        <input
          type="file"
          className="file-input w-full max-w-xs"
          accept="image/*"
          onChange={handleImage}
        />
        {formData.imageURL && (
          <>Image already uploaded, upload file to change image.</>
        )}
      </label>
      <label className="form-control w-full">
        <div className="label">
          <span className="label-text">
            Available Sizes <span className="text-red-500">*</span>
          </span>
        </div>
        <ul className="menu  menu-horizontal rounded-box bg-base-200">
          <li>
            <a
              className={formData.sizes.includes("S") ? "active" : ""}
              onClick={() => handleSizeClick("S")}
            >
              S
            </a>
          </li>
          <li>
            <a
              className={formData.sizes.includes("M") ? "active" : ""}
              onClick={() => handleSizeClick("M")}
            >
              M
            </a>
          </li>
          <li>
            <a
              className={formData.sizes.includes("L") ? "active" : ""}
              onClick={() => handleSizeClick("L")}
            >
              L
            </a>
          </li>
        </ul>
      </label>
      <label className="form-control w-full ">
        <div className="label">
          <span className="label-text">
            Name of Product <span className="text-red-500">*</span>
          </span>
        </div>
        <input
          type="text"
          placeholder="Enter name"
          className="input input-bordered w-full "
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          value={formData.name}
        />
      </label>
      <label className="form-control w-full ">
        <div className="label">
          <span className="label-text">
            Price of Product <span className="text-red-500">*</span>
          </span>
        </div>
        <input
          type="number"
          placeholder="Enter price"
          className="input input-bordered w-full "
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          value={formData.price}
        />
      </label>
      <label className="form-control w-full ">
        <div className="label">
          <span className="label-text">Description of Product</span>
        </div>
        <input
          type="text"
          placeholder="Enter description"
          className="input input-bordered w-full "
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          value={formData.description}
        />
      </label>
      <label className="form-control w-full ">
        <div className="label">
          <span className="label-text">Category</span>
        </div>

        <select
          onChange={(e) =>
            setFormData({ ...formData, category: e.target.value })
          }
          className="select select-bordered"
          value={formData.category}
        >
          <option value="Everyone">Everyone</option>
          <option value="Men">Men</option>
          <option value="Women">Women</option>
          <option value="Kids">Kids</option>
        </select>
      </label>
      <label className="form-control w-full ">
        <div className="label">
          <span className="label-text">Delivery Info</span>
        </div>
        <input
          type="text"
          placeholder="Enter delivery info"
          className="input input-bordered w-full "
          onChange={(e) =>
            setFormData({ ...formData, deliveryInfo: e.target.value })
          }
          value={formData.deliveryInfo}
        />
      </label>
      <label className="form-control w-full ">
        <div className="label">
          <span className="label-text">On Sale</span>
        </div>
        <select
          onChange={(e) => setFormData({ ...formData, onSale: e.target.value })}
          className="select select-bordered"
          value={formData.onSale}
        >
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </label>

      <label className="form-control w-full ">
        <div className="label">
          <span className="label-text">Price Drop</span>
        </div>
        <input
          type="number"
          placeholder="Enter Price Drop"
          className="input input-bordered w-full "
          onChange={(e) =>
            setFormData({ ...formData, priceDrop: e.target.value })
          }
          value={formData.priceDrop}
        />
      </label>
      <button
        className="btn mt-2 w-full"
        onClick={handleUpdateProduct}
        disabled={imageUploading}
      >
        Update Product
        {componentLoader.loading ? <Loader /> : null}
      </button>
    </div>
  );
};

export default UpdateProduct;
