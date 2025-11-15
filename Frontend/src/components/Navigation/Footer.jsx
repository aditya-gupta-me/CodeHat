import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

// Helper functions for formatting numbers
const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
};

const formatCodeExecutions = (num) => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)} million`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)} thousand`;
  }
  return num.toString();
};

function Footer() {
  const GitHubURL = import.meta.env.VITE_GITHUB;
  const X_URL = import.meta.env.VITE_X;
  const StackOverflow_URL = import.meta.env.VITE_StackOverflow;
  const LinkedIn_URL = import.meta.env.VITE_LinkedIn;

  const API_URL = import.meta.env.VITE_BACKEND_API;

  const [visitorCount, setVisitorCount] = useState(null);
  const [codeExecutionCount, setCodeExecutionCount] = useState(null);
  const [loading, setLoading] = useState(true);

  // Track visitor on component mount
  useEffect(() => {
    const trackAndFetchData = async () => {
      try {
        // Track visitor
        let visitorId = localStorage.getItem("visitorId");

        if (!visitorId) {
          visitorId = `visitor_${Date.now()}_${Math.random()
            .toString(36)
            .substr(2, 9)}`;
          localStorage.setItem("visitorId", visitorId);
        }

        await axios.post(`${API_URL}/api/track-visitor`, {
          visitorId,
        });

        // Fetch counts
        const [visitorRes, executionRes] = await Promise.all([
          axios.get(`${API_URL}/api/visitor-count`),
          axios.get(`${API_URL}/api/code-execution-count`),
        ]);

        setVisitorCount(visitorRes.data.count);
        setCodeExecutionCount(executionRes.data.linesExecuted);
      } catch (error) {
        console.error("Error fetching counts:", error);
      } finally {
        setLoading(false);
      }
    };

    trackAndFetchData();

    // Refresh counts every 30 seconds
    const interval = setInterval(async () => {
      try {
        const [visitorRes, executionRes] = await Promise.all([
          axios.get(`${API_URL}/api/visitor-count`),
          axios.get(`${API_URL}/api/code-execution-count`),
        ]);
        setVisitorCount(visitorRes.data.count);
        setCodeExecutionCount(executionRes.data.linesExecuted);
      } catch (error) {
        console.error("Error refreshing counts:", error);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [API_URL]);

  return (
    <footer className="bg-black dark:bg-gray-900 w-full mt-auto">
      <div className="mx-auto w-full container p-4 sm:p-6">
        {/* Stats Section - New Addition */}
        <div className="mb-8 flex flex-col md:flex-row justify-between gap-4 md:gap-8">
          <div className="flex items-center space-x-3 text-gray-400">
            <svg
              className="w-5 h-5 text-blue-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm">
              {loading ? (
                <span className="inline-block w-32 h-4 bg-gray-700 rounded animate-pulse"></span>
              ) : (
                <>
                  Over{" "}
                  <span className="font-semibold text-white">
                    {formatCodeExecutions(codeExecutionCount)}
                  </span>{" "}
                  lines of code executed
                </>
              )}
            </span>
          </div>

          <div className="flex items-center space-x-3 text-gray-400 justify-end">
            <svg
              className="w-5 h-5 text-green-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path
                fillRule="evenodd"
                d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm">
              {loading ? (
                <span className="inline-block w-20 h-4 bg-gray-700 rounded animate-pulse"></span>
              ) : (
                <>
                  Visited by over{" "}
                  <span className="font-semibold text-white">
                    {formatNumber(visitorCount)}
                  </span>{" "}
                  people
                </>
              )}
            </span>
          </div>
        </div>

        <div className="md:flex md:justify-between">
          <div className="mb-6 md:mb-0">
            <Link to="/" className="flex items-center">
              <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
                CodeHat
              </span>
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
            <div>
              <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">
                Resources
              </h2>
              <ul className="text-gray-600 dark:text-gray-400">
                <li className="mb-4">
                  <a
                    href="https://ocw.mit.edu/courses/6-0001-introduction-to-computer-science-and-programming-in-python-fall-2016/"
                    className="hover:underline"
                  >
                    Learn
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:underline"
                    title="Work in Progress..."
                  >
                    Community
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">
                Company
              </h2>
              <ul className="text-gray-600 dark:text-gray-400">
                <li className="mb-4">
                  <Link to="/vision" className="hover:underline ">
                    Vision
                  </Link>
                </li>
                <li>
                  <a href="you will never find me" className="hover:underline">
                    About Us
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">
                Legal
              </h2>
              <ul className="text-gray-600 dark:text-gray-400">
                <li className="mb-4">
                  <Link to="/privacy" className="hover:underline">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/termsofservice" className="hover:underline">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <hr className="my-6 border-gray-200 sm:mx-auto dark:border-white-700 lg:my-8" />
        <div className="sm:flex sm:items-center sm:justify-between">
          <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
            © 2025{" "}
            <a href="#" className="hover:underline">
              CodeHat™
            </a>
            . All Rights Reserved.
          </span>

          <span className="text-gray-400 content-center">
            Built with ❤️ & React MUI
          </span>

          <div className="flex mt-4 space-x-6 sm:justify-center sm:mt-0">
            <a
              href={GitHubURL}
              target="_blank"
              className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  fill-rule="evenodd"
                  d="M12.026 2c-5.509 0-9.974 4.465-9.974 9.974 0 4.406 2.857 8.145 6.821 9.465.499.09.679-.217.679-.481 0-.237-.008-.865-.011-1.696-2.775.602-3.361-1.338-3.361-1.338-.452-1.152-1.107-1.459-1.107-1.459-.905-.619.069-.605.069-.605 1.002.07 1.527 1.028 1.527 1.028.89 1.524 2.336 1.084 2.902.829.091-.645.351-1.085.635-1.334-2.214-.251-4.542-1.107-4.542-4.93 0-1.087.389-1.979 1.024-2.675-.101-.253-.446-1.268.099-2.64 0 0 .837-.269 2.742 1.021a9.6 9.6 0 0 1 2.496-.336 9.6 9.6 0 0 1 2.496.336c1.906-1.291 2.742-1.021 2.742-1.021.545 1.372.203 2.387.099 2.64.64.696 1.024 1.587 1.024 2.675 0 3.833-2.33 4.675-4.552 4.922.355.308.675.916.675 1.846 0 1.334-.012 2.41-.012 2.737 0 .267.178.577.687.479C19.146 20.115 22 16.379 22 11.974 22 6.465 17.535 2 12.026 2"
                  clip-rule="evenodd"
                ></path>
              </svg>
              <span className="sr-only">GitHub account</span>
            </a>
            <a
              href={LinkedIn_URL}
              className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M20 3H4a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1M8.339 18.337H5.667v-8.59h2.672zM7.003 8.574a1.548 1.548 0 1 1 0-3.096 1.548 1.548 0 0 1 0 3.096m11.335 9.763h-2.669V14.16c0-.996-.018-2.277-1.388-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248h-2.667v-8.59h2.56v1.174h.037c.355-.675 1.227-1.387 2.524-1.387 2.704 0 3.203 1.778 3.203 4.092v4.71z"></path>
              </svg>
              <span className="sr-only">LinkedIn Profile</span>
            </a>

            <a
              href={X_URL}
              className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
                className="w-5 h-5"
              >
                <path d="M13.68 10.62 20.24 3h-1.55L13 9.62 8.45 3H3.19l6.88 10.01L3.19 21h1.55l6.01-6.99 4.8 6.99h5.24l-7.13-10.38Zm-2.13 2.47-.7-1-5.54-7.93H7.7l4.47 6.4.7 1 5.82 8.32H16.3z"></path>
              </svg>
              <span className="sr-only">Twitter page</span>
            </a>

            <a
              href={StackOverflow_URL}
              className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M17.24 19.399v-4.804h1.6V21H4.381v-6.405h1.598v4.804zM7.582 17.8h8.055v-1.604H7.582zm.195-3.64 7.859 1.641.34-1.552-7.861-1.642zm1.018-3.794 7.281 3.398.678-1.463-7.281-3.399-.678 1.454zm2.037-3.589 6.166 5.142 1.018-1.216-6.162-5.14-1.016 1.213zm3.982-3.778-1.311.969 4.803 6.454 1.313-.971-4.807-6.452z"></path>
              </svg>
              <span className="sr-only">StackOverflow Profile</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
