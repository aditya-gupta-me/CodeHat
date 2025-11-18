import { Link } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../Firebase";

function LandingPage() {
  const [user] = useAuthState(auth);
  return (
    <>
      <section
        className="min-h-screen bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('landing_page.png')",
        }}
      >
        <div className="min-h-screen flex items-start pt-24 sm:pt-32 md:pt-40 lg:pt-48 px-6 sm:px-10 md:px-16 lg:px-20">
          <div className="max-w-xl lg:max-w-2xl">
            <h1 className="mb-4 sm:mb-6 text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-sky-900 to-emerald-600">
                Don't Know
              </span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-emerald-600">
                How To Code.
              </span>
            </h1>

            <div className="mb-6 sm:mb-8 space-y-1">
              <p className="text-sm sm:text-base md:text-lg lg:text-xl font-medium text-gray-800">
                Use this platform to
              </p>

              <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">
                Learn Coding
              </p>

              <p className="text-sm sm:text-base md:text-lg lg:text-xl font-medium text-gray-800">
                and become
              </p>

              <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">
                Job Ready.
              </p>
            </div>

            <Link
              to={user ? "/practice" : "/register"}
              className="inline-flex items-center justify-center px-5 py-2.5 sm:px-6 sm:py-3 text-sm sm:text-base font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 transition-colors shadow-lg"
            >
              {user ? "Continue" : "Start Now"}
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 ml-2"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default LandingPage;
