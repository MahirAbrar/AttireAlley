import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { registerNewUser } from "../services/register";

const RegisterForm = () => {
  const router = useRouter();

  const [formState, setFormState] = useState({
    name: "",
    email: "",
    password: "",
    "confirm-password": "",
    role: "customer",
    // terms todo
    terms: false,
  });

  const [nameTyped, setNameTyped] = useState(false);
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    if (name === "name" && value !== "") {
      setNameTyped(true);
    }
  };

  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

  function isFormValid() {
    return formState &&
      formState.name &&
      formState.name.trim() !== "" &&
      formState.email &&
      formState.email.trim() !== "" &&
      formState.password &&
      formState.password.trim() !== "" &&
      formState["confirm-password"] &&
      formState.password == formState["confirm-password"] &&
      emailRegex.test(formState.email)
      ? true
      : false;
  }

  async function handleRegisterOnSubmit() {
    // calls database and save the data
    console.log("submitting form");
    const data = await registerNewUser(formState);
    console.log(data);
  }

  return (
    <>
      <div>
        <label
          htmlFor="name"
          className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
        >
          Name
        </label>
        <input
          type="text"
          onChange={handleChange}
          name="name"
          id="name"
          className="focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 sm:text-sm"
          placeholder="John Doe"
          required=""
        />
        {formState.name === "" && nameTyped ? (
          <span className="text-sm text-red-600">Name cannot be empty</span>
        ) : null}
      </div>
      <div>
        <label
          htmlFor="email"
          className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
        >
          Email
        </label>
        <input
          type="email"
          onChange={handleChange}
          name="email"
          id="email"
          className="focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 sm:text-sm"
          placeholder="name@company.com"
          required=""
        />
        {!emailRegex.test(formState.email) && formState.email.trim() !== "" ? (
          <span className="text-sm text-red-600">Invalid email format</span>
        ) : null}
      </div>
      <div>
        <label
          htmlFor="password"
          className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
        >
          Password
        </label>
        <input
          type="password"
          onChange={handleChange}
          name="password"
          id="password"
          placeholder="••••••••"
          className="focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 sm:text-sm"
          required=""
        />
      </div>
      {/* todo big password */}
      <div>
        <label
          htmlFor="confirm-password"
          className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
        >
          Confirm password
        </label>
        <input
          type="password"
          onChange={handleChange}
          name="confirm-password"
          id="confirm-password"
          placeholder="••••••••"
          className="focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 sm:text-sm"
          required=""
        />
        {formState.password &&
        formState["confirm-password"] &&
        formState.password != formState["confirm-password"] ? (
          <span className="text-sm text-red-600">Password do not match</span>
        ) : null}
      </div>
      <div>
        <label
          htmlFor="countries"
          className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
        >
          Select an option
        </label>
        <select
          id="role"
          name="role"
          onChange={handleChange}
          className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
        >
          <option value="client">Customer</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <div className="flex items-start">
        <div className="flex h-5 items-center">
          <input
            id="terms"
            aria-describedby="terms"
            type="checkbox"
            className="checked={formState.terms} h-4 w-4 rounded border border-gray-300 bg-gray-50"
          />
        </div>
        <div className="ml-3 text-sm">
          <label
            htmlFor="terms"
            className="font-light text-gray-500 dark:text-gray-300"
          >
            I accept the{" "}
            <label
              htmlFor="my_modal_7"
              className="cursor-pointer text-text underline dark:text-textDark"
            >
              Terms and conditions
            </label>
            <input type="checkbox" id="my_modal_7" className="modal-toggle" />
            <div className="modal" role="dialog">
              <div className="modal-box ">
                <h3 className="text-center text-lg font-bold text-text dark:text-textDark">
                  Terms and Conditions
                </h3>
                <div className="overflow-auto  text-center">
                  <p className="text-text dark:text-textDark">
                    <strong>Last Updated:</strong> [Date]
                  </p>

                  <p className="text-text dark:text-textDark">
                    Welcome to eComms! By accessing our website located at
                    [Website URL], you agree to these terms and conditions. Do
                    not continue to use eComms if you do not agree to all of the
                    terms stated on this page.
                  </p>

                  <h4 className="mt-3 font-bold text-text dark:text-textDark">
                    1. Use of the Website
                  </h4>
                  <p className="text-text dark:text-textDark">
                    You agree not to misuse the eComms website or help anyone
                    else do so. You are specifically restricted from publishing
                    any website material in other media, selling or
                    commercializing any website material, or using the website
                    in any way that is damaging or impacts user access.
                  </p>

                  <h4 className="mt-3 font-bold text-text dark:text-textDark">
                    2. Products and Services
                  </h4>
                  <p className="text-text dark:text-textDark">
                    eComms offers various products and services subject to
                    return or exchange according to our Return Policy. Prices
                    and availability may change without notice, and eComms
                    reserves the right to discontinue any product at any time.
                  </p>

                  <h4 className="mt-3 font-bold text-text dark:text-textDark">
                    3. Intellectual Property Rights
                  </h4>
                  <p className="text-text dark:text-textDark">
                    All intellectual property rights for content on the eComms
                    website, except content you own, belong to us or our
                    licensors. You are granted a limited license only for
                    viewing the material on this website.
                  </p>
                </div>
              </div>

              <label className="modal-backdrop" htmlFor="my_modal_7">
                Close
              </label>
            </div>
          </label>
        </div>
      </div>

      {isFormValid() ? (
        <button
          type="submit"
          className="text-white-700 m-3 w-full rounded border border-accent  bg-transparent px-4 py-2 font-semibold transition delay-150 duration-300 ease-in-out hover:scale-110 hover:cursor-pointer hover:border-transparent  hover:bg-primary hover:text-white"
          onClick={() => handleRegisterOnSubmit()}
        >
          Create an account
        </button>
      ) : (
        <button
          type="submit"
          className="text-white-700 m-3 w-full rounded border border-accent bg-transparent px-4 py-2 font-semibold"
          disabled={true}
        >
          Create an account
        </button>
      )}

      <p className="text-sm font-light text-gray-500 dark:text-gray-400">
        Already have an account?{" "}
        <span
          className="text-decoration-line:	underline hover:cursor-pointer"
          onClick={() => router.push("/login")}
        >
          Login here
        </span>
      </p>
    </>
  );
};

export default RegisterForm;
