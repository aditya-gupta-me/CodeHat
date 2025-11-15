// NoLoginError.jsx
import React from "react";
import { Link } from "react-router-dom";

const NoLoginError = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div className="mx-auto max-w-screen-sm text-center">
          <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-blue-600 dark:text-blue-500">
            401
          </h1>
          <p className="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">
            Login Required
          </p>
          <p className="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">
            You need to be logged in to access this page. Please login to
            continue.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Link
              to="/login"
              className="inline-flex text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-6 py-3 text-center dark:focus:ring-blue-900 transition-colors shadow-md hover:shadow-lg"
            >
              Login Now
            </Link>
            <Link
              to="/"
              className="inline-flex text-gray-700 bg-transparent border-2 border-gray-400 hover:border-gray-600 hover:bg-gray-50 focus:ring-4 focus:outline-none focus:ring-gray-200 font-medium rounded-lg text-sm px-6 py-3 text-center dark:text-gray-300 dark:border-gray-500 dark:hover:border-gray-400 dark:hover:bg-gray-800 dark:focus:ring-gray-700 transition-all"
            >
              Back to Homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoLoginError;
