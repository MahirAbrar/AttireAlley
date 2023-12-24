import React, { useState } from 'react'
import { useRouter } from 'next/navigation';

const RegisterForm = () => {


  const router = useRouter()

  const [formState, setFormState] = useState({
    name: "",
    email: "",
    password: "",
    'confirm-password': "",
    role: "customer",
    terms: false,
  });

  const [nameTyped, setNameTyped] = useState(false);
  // Handle input changes
  const handleChange = (e) => {

    const { name, value } = e.target;
    setFormState(prevState => ({
      ...prevState,
      [name]: value
    }));
    if (name === "name" && value !== '') {
      setNameTyped(true);
    }
  }



  function isFormValid() {
    return formState &&
      formState.name &&
      formState.name.trim() !== "" &&
      formState.email &&
      formState.email.trim() !== "" &&
      formState.password &&
      formState.password.trim() !== "" &&
      formState['confirm-password'] &&
      formState.password != formState['confirm-password']
      ? true
      : false;
  }

  // True: valid, 
  const btnStyle = isFormValid() ? "w-full bg-transparent hover:cursor-pointer hover:bg-blue-700 text-white-700 font-semibold hover:text-white py-2 px-4 m-3 border border-blue-500 hover:border-transparent rounded transition ease-in-out delay-150 bg-blue-500 hover:scale-110 hover:bg-indigo-500 duration-300" : "w-full bg-transparent text-white-700 font-semibold py-2 px-4 m-3 border border-blue-500 rounded transition ease-in-out delay-150 bg-blue-500 hover:cursor-default"


  return (
    <>
      <div>
        <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
        <input type="text" onChange={handleChange} name="name" id="name" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="John Doe" required="" />
        {formState.name === '' && nameTyped ? <span className='text-sm text-red-600'>Name cannot be empty</span> : null}
      </div >
      <div>
        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
        <input type="email" onChange={handleChange} name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" required="" />
      </div>
      <div>
        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
        <input type="password" onChange={handleChange} name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" />
      </div>
      <div>
        <label htmlFor="confirm-password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm password</label>
        <input type="password" onChange={handleChange} name="confirm-password" id="confirm-password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" />
        {formState.password && formState['confirm-password'] && formState.password != formState['confirm-password'] ? <span className='text-sm text-red-600'>Password do not match</span> : null}
      </div>
      <div>
        <label htmlFor="countries" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select an option</label>
        <select id="role" name="role" onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
          <option value="client">Customer</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <div className="flex items-start">
        <div className="flex items-center h-5">
          {/* to do */}
          <input id="terms" aria-describedby="terms" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 checked={formState.terms}" />

        </div>
        <div className="ml-3 text-sm">
          <label htmlFor="terms" className="font-light text-gray-500 dark:text-gray-300">I accept the (TODO) <a className="font-medium text-primary-600 hover:underline dark:text-primary-500" href="#">Terms and Conditions</a></label>
        </div>
      </div>
      <button type="submit" className={btnStyle} disabled={isFormValid()} onClick={() => console.log("registered")}>Create an account</button>
      <p className="text-sm font-light text-gray-500 dark:text-gray-400">
        Already have an account? <span className="hover:cursor-pointer	text-decoration-line: underline" onClick={() => router.push('/login')}>Login here</span>
      </p>
    </>

  )
}

export default RegisterForm