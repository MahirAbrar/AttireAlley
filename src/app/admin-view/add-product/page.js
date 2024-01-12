"use client";
import React, { useState, useContext, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { firebaseConfig, firebaseStroageURL } from "@/utils";
import {
  getStorage,
  uploadBytesResumable,
  ref,
  getDownloadURL,
} from "firebase/storage";
import { GlobalContext } from "@/context/index";
import { useRouter } from "next/navigation";

// This is saved in the env.local file FIREBASE_STORAGE_URL=gs://next-js-ecomm-478a2.appspot.com how do i access it?
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

  const [selectedSize, setSelectedSize] = useState("S");

  async function handleImage(event) {
    const extractImageUrl = await imageUploadHelper(event.target.files[0]);

    console.log(extractImageUrl);
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
              className={selectedSize === "S" ? "active" : ""}
              onClick={() => setSelectedSize("S")}
            >
              S
            </a>
          </li>
          <li>
            <a
              className={selectedSize === "M" ? "active" : ""}
              onClick={() => setSelectedSize("M")}
            >
              M
            </a>
          </li>
          <li>
            <a
              className={selectedSize === "L" ? "active" : ""}
              onClick={() => setSelectedSize("L")}
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
        />
      </label>
      <label className="form-control w-full ">
        <div className="label">
          <span className="label-text">Category</span>
        </div>
        <select className="select select-bordered">
          <option>Men</option>
          <option>Women</option>
          <option>Kids</option>
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
        />
      </label>
      <label className="form-control w-full ">
        <div className="label">
          <span className="label-text">On Sale</span>
        </div>
        <select className="select select-bordered">
          <option>Yes</option>
          <option>No</option>
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
        />
      </label>
      <button className="btn mt-2 w-full">Add Product</button>
    </div>
  );
};

export default addProduct;
