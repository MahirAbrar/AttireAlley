"use client";
import React, { useState, useContext, useEffect } from "react";
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
import { addNewProduct } from "@/app/services/addProduct";
import { toast } from "react-toastify";

// This is saved in the env.local file FIREBASE_STORAGE_URL=gs://next-js-ecomm-478a2.appspot.com how do i access it?
const firebaseStorageUrl = process.env.FIREBASE_STORAGE_URL;

const addProduct = () => {
  const app = initializeApp(firebaseConfig);
  const storage = getStorage(app, firebaseStorageUrl);

  const router = useRouter();

  const { componentLoader, setComponentLoader, isAuthUser, user } =
    useContext(GlobalContext);

  // Got user
  useEffect(() => {
    // Redirect if not authenticated or not an admin
    if (isAuthUser === false || user?.role !== "admin") {
      router.push("/some-other-site");
    } else {
      setFormData({ ...formData, user: user?.name });
    }
  }, [isAuthUser, user, router]);

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
    imageURL: "",
    priceDrop: 0,
  });

  async function handleImage(event) {
    setImageUploading(true);
    const extractImageUrl = await imageUploadHelper(event.target.files[0]);
    toast.success("Image uploaded successfully.");

    if (extractImageUrl) {
      setFormData({ ...formData, imageURL: extractImageUrl });
    }

    setImageUploading(false);
  }

  // Creates a unique file name.
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
        (snapshot) => {},
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
      toast.error("Select at least 1 style.");
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
    // set to default
    setFormData({
      user: "",
      name: "",
      description: "",
      price: 0,
      category: "Everyone",
      sizes: [],
      deliveryInfo: "",
      onSale: "No",
      imageURL: "",
      priceDrop: 0,
    });
  }
  if (!isAuthUser || user?.role !== "admin") {
    return <Loader />;
  }

  return (
    <div className="card w-full max-w-sm shrink-0 bg-base-100 p-4 shadow-2xl">
      <label className="form-control w-full">
        <input
          type="file"
          className="file-input w-full max-w-xs"
          accept="image/*"
          onChange={handleImage}
        />
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
        >
          <option value="Kids">Everyone</option>
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
        />
      </label>
      <label className="form-control w-full ">
        <div className="label">
          <span className="label-text">On Sale</span>
        </div>
        <select
          onChange={(e) => setFormData({ ...formData, onSale: e.target.value })}
          className="select select-bordered"
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
        onClick={handleAddProduct}
        disabled={imageUploading}
      >
        Add Product
        {componentLoader.loading ? <Loader /> : null}
      </button>
    </div>
  );
};

export default addProduct;
