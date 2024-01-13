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
import { addNewProduct } from "@/app/services/product";
import Loader from "@/components/Loader";
import { toast } from "react-toastify";
import { set } from "mongoose";

const firebaseStorageUrl = process.env.FIREBASE_STORAGE_URL;

const addProduct = () => {
  const app = initializeApp(firebaseConfig);
  const storage = getStorage(app, firebaseStorageUrl);

  const router = useRouter();
  const { isAuthUser, user } = useContext(GlobalContext);

  // toadd user
  // useEffect(() => {
  //   if (!isAuthUser) router.push("/");
  // }, []);

  //Store who is adding the data

  const [componentLoader, setComponentLoader] = useState({
    loading: false,
    id: "",
  });
  const [formData, setFormData] = useState({
    sizes: [],
    name: "",
    price: 0,
    description: "",
    category: "Men",
    deliveryInfo: "",
    onSale: "No",
    imageURL: "",
    priceDrop: 0,
  });

  async function handleImage(event) {
    const extractImageUrl = await imageUploadHelper(event.target.files[0]);

    console.log(extractImageUrl);

    if (extractImageUrl) {
      setFormData({ ...formData, imageURL: extractImageUrl });
    }
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
          console.log(error);
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
    setComponentLoader({ loading: true, id: "" });
    const res = await addNewProduct(formData);
    console.log(res);
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
      sizes: [],
      name: "",
      price: 0,
      description: "",
      category: "Men",
      deliveryInfo: "",
      onSale: "No",
      imageURL: "",
      priceDrop: 0,
    });
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
          <span className="label-text">Available Sizes</span>
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
          <span className="label-text">Name of Product</span>
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
          <span className="label-text">Price of Product</span>
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
        />
      </label>
      <button className="btn mt-2 w-full" onClick={handleAddProduct}>
        Add Product
        <Loader loading={componentLoader.loading} id={componentLoader.id} />
      </button>
    </div>
  );
};

export default addProduct;
