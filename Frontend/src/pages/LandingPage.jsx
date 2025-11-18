import { Link } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../Firebase";

function LandingPage() {
  const [user] = useAuthState(auth);
  return (
    <>
      <section
        className="px-4 lg:px-16 bg-cover bg-center"
        style={{
          backgroundImage: "url('landing_page.png')",
        }}
      >
        <div className="bg-opacity-60 py-10 px-6 lg:py-20 lg:px-32">
          <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-900 md:text-5xl lg:text-6xl">
            <span className="leading-loose">Don't Know</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">
              How To Code.
            </span>
          </h1>

          <p className="mb-6 text-left text-black font-sans space-y-3">
            <span className="block text-xl lg:text-2xl font-medium text-gray-700 tracking-wide">
              Use this platform to
            </span>

            <span className="block text-4xl lg:text-5xl font-semibold text-gray-800">
              Learn Coding
            </span>

            <span className="block text-xl lg:text-2xl font-medium text-gray-700 tracking-wide">
              and become
            </span>

            <span className="block text-4xl lg:text-5xl font-semibold text-gray-800">
              Job Ready.
            </span>
          </p>

          <Link
            to={user ? "/practice" : "/register"} // Change the route based on user's authentication
            className="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900"
          >
            {user ? "Continue" : "Start Now"}
            <svg
              className="animate-ping w-5 h-5 ml-2 -mr-1"
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
      </section>
    </>
  );
}

export default LandingPage;
