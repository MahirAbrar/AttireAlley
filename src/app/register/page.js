'use client';

import React from 'react'
import RegisterForm from './registerForm';

const isRegistered = false;
const btnStyle = "bg-transparent hover:bg-blue-500 text-white-700 font-semibold hover:text-white py-2 px-4 m-3 border border-blue-500 hover:border-transparent rounded transition ease-in-out delay-150 bg-blue-500 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 duration-300"


const register = () => {
  return (
    <div>

      <section class="bg-gray-50 dark:bg-gray-900">
        <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto h-screen lg:py-0">
          <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div class="p-6 space-y-4 md:space-y-6 sm:p-8">

              <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white text-center">
                Sign up
              </h1>

              {/* paste here */}
              {!isRegistered ? <RegisterForm /> : (<div className='text-center'><h1 className='text-center text-xl'>Already Registered!</h1>  <a href=''><button className={btnStyle}> Client view</button> </a></div>)}

            </div>
          </div>
        </div>
      </section>

    </div>
  )
}

export default register