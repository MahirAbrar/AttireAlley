import React, { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { registerNewUser } from "../../services/register";
import { toast } from "react-toastify";
import { GlobalContext } from "@/context/index";
import Loader from "@/components/Loader";

const RegisterForm = () => {
  const router = useRouter();
  const { componentLoader, setComponentLoader } = useContext(GlobalContext);

  const [formState, setFormState] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "customer",
    terms: false,
  });

  const [nameTyped, setNameTyped] = useState(false);
  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (name === "name" && value !== "") {
      setNameTyped(true);
    }
  };

  const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;

  function isFormValid() {
    return (
      formState &&
      formState.name &&
      formState.name.trim() !== "" &&
      formState.email &&
      formState.email.trim() !== "" &&
      formState.password &&
      formState.password.trim() !== "" &&
      formState.password.length >= 6 &&
      formState.confirmPassword &&
      formState.password === formState.confirmPassword &&
      emailRegex.test(formState.email) &&
      formState.terms
    );
  }

  async function handleRegisterOnSubmit(e) {
    e.preventDefault();
    setComponentLoader({ loading: true, id: "" });
    
    const res = await registerNewUser(formState);
    
    if (res.success) {
      toast.success(res.data?.message || "Account created successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
      });
      setFormState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "customer",
        terms: false,
      });
      router.push("/login");
    } else {
      toast.error(res.message || "Registration failed", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
      });
    }
    setComponentLoader({ loading: false, id: "" });
  }

  return (
    <form className="space-y-6" onSubmit={handleRegisterOnSubmit}>
      <div className="form-element">
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Full Name
        </label>
        <input
          type="text"
          onChange={handleChange}
          name="name"
          id="name"
          value={formState.name}
          className="mt-1 block w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-400 transition-all focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:bg-gray-700"
          placeholder="John Doe"
          required
        />
        {formState.name === "" && nameTyped && (
          <span className="mt-1 text-sm text-red-600">Name cannot be empty</span>
        )}
      </div>
      <div className="form-element">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Email Address
        </label>
        <input
          type="email"
          onChange={handleChange}
          name="email"
          id="email"
          value={formState.email}
          className="mt-1 block w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-400 transition-all focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:bg-gray-700"
          placeholder="name@company.com"
          required
        />
        {!emailRegex.test(formState.email) && formState.email.trim() !== "" && (
          <span className="mt-1 text-sm text-red-600">Invalid email format</span>
        )}
      </div>
      
      <div className="form-element">
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Password
        </label>
        <input
          type="password"
          onChange={handleChange}
          name="password"
          id="password"
          value={formState.password}
          placeholder="Minimum 6 characters"
          className="mt-1 block w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-400 transition-all focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:bg-gray-700"
          required
        />
        {formState.password && formState.password.length < 6 && (
          <span className="mt-1 text-sm text-red-600">Password must be at least 6 characters</span>
        )}
      </div>
      
      <div className="form-element">
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Confirm Password
        </label>
        <input
          type="password"
          onChange={handleChange}
          name="confirmPassword"
          id="confirmPassword"
          value={formState.confirmPassword}
          placeholder="Re-enter your password"
          className="mt-1 block w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-400 transition-all focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:bg-gray-700"
          required
        />
        {formState.password &&
        formState.confirmPassword &&
        formState.password !== formState.confirmPassword && (
          <span className="mt-1 text-sm text-red-600">Passwords do not match</span>
        )}
      </div>
      <div className="form-element">
        <label
          htmlFor="role"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Account Type
        </label>
        <select
          id="role"
          name="role"
          value={formState.role}
          onChange={handleChange}
          className="mt-1 block w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:bg-gray-700"
        >
          <option value="customer">Customer</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <div className="form-element flex items-start">
        <div className="flex h-5 items-center">
          <input
            id="terms"
            name="terms"
            type="checkbox"
            checked={formState.terms}
            onChange={handleChange}
            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
        </div>
        <div className="ml-3 text-sm">
          <label
            htmlFor="terms"
            className="text-gray-600 dark:text-gray-400"
          >
            I agree to the{" "}
            <a
              href="#"
              className="font-medium text-primary hover:text-primary/80"
            >
              Terms and Conditions
            </a>{" "}
            and{" "}
            <a
              href="#"
              className="font-medium text-primary hover:text-primary/80"
            >
              Privacy Policy
            </a>
          </label>
        </div>
      </div>

      <button
        type="submit"
        disabled={!isFormValid() || componentLoader.loading}
        className={`form-element relative w-full rounded-xl px-4 py-3 text-sm font-semibold text-white transition-all duration-200 ${
          isFormValid() && !componentLoader.loading
            ? "bg-primary hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25"
            : "cursor-not-allowed bg-gray-400"
        }`}
      >
        {componentLoader.loading ? (
          <div className="flex items-center justify-center">
            <Loader />
            <span className="ml-2">Creating account...</span>
          </div>
        ) : (
          "Create Account"
        )}
      </button>

      <p className="form-element text-center text-sm text-gray-600 dark:text-gray-400">
        Already have an account?{" "}
        <button
          type="button"
          onClick={() => router.push("/login")}
          className="font-semibold text-primary transition-colors hover:text-primary/80"
        >
          Sign in
        </button>
      </p>
    </form>
  );
};

export default RegisterForm;
