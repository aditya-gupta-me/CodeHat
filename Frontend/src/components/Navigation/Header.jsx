import { Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const navigation = [
  { name: "Home", to: "/" },
  { name: "Practice", to: "/practice" },
  { name: "Compete", to: "/participate" },
  { name: "Compiler", to: "/compiler/python" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Header() {
  const { user, username, signOut: handleSignOut } = useAuth();
  const location = useLocation();

  /**
   * Get user initials for the avatar circle.
   */
  const getInitials = () => {
    if (username) {
      return username.slice(0, 2).toUpperCase();
    }
    if (user?.email) {
      return user.email.slice(0, 2).toUpperCase();
    }
    return "U";
  };

  return (
    <Disclosure as="nav" className="bg-ch-dark border-b border-ch-border">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              {/* Mobile menu button */}
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-ch-muted hover:text-ch-text hover:bg-ch-surface focus:outline-none focus:ring-2 focus:ring-ch-accent">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>

              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                {/* Logo */}
                <div className="flex flex-shrink-0 items-center">
                  <Link
                    to="/"
                    className="text-2xl font-display font-bold text-ch-accent tracking-tight"
                  >
                    CodeHat
                  </Link>
                </div>

                {/* Desktop nav */}
                <div className="hidden sm:ml-10 sm:block">
                  <div className="flex space-x-1">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.to}
                        className={classNames(
                          location.pathname === item.to ||
                            (item.to !== "/" && location.pathname.startsWith(item.to))
                            ? "text-ch-accent"
                            : "text-ch-muted hover:text-ch-text",
                          "rounded-md px-3 py-2 text-sm font-medium transition-colors duration-150"
                        )}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right side */}
              <div className="absolute inset-y-0 right-0 flex items-center gap-3 pr-2 sm:static sm:inset-auto sm:pr-0">
                {/* Username display */}
                {user && username && (
                  <span className="hidden md:block text-sm text-ch-muted font-code">
                    @{username}
                  </span>
                )}

                {/* Profile dropdown */}
                <Menu as="div" className="relative">
                  <Menu.Button className="flex items-center justify-center w-9 h-9 rounded-full bg-ch-surface border border-ch-accent/40 text-ch-accent font-code text-xs font-bold focus:outline-none focus:ring-2 focus:ring-ch-accent focus:ring-offset-2 focus:ring-offset-ch-dark transition-colors hover:border-ch-accent">
                    <span className="sr-only">Open user menu</span>
                    {getInitials()}
                  </Menu.Button>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-52 origin-top-right rounded-lg bg-ch-surface border border-ch-border py-1 shadow-xl shadow-black/30 focus:outline-none">
                      <Menu.Item>
                        {user ? (
                          <>
                            <span className="block px-4 py-2.5 text-sm font-medium text-ch-text border-b border-ch-border">
                              <span role="img" aria-label="Hat" className="mr-1">
                                🎩
                              </span>{" "}
                              {username || "User"}
                            </span>

                            <Link
                              to="/userprofile"
                              className="flex items-center gap-2 px-4 py-2 text-sm text-ch-muted hover:text-ch-text hover:bg-ch-surface-raised transition-colors duration-150"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M5.121 17.804A11.955 11.955 0 0112 15c2.485 0 4.779.755 6.879 2.047M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                              </svg>
                              Your Profile
                            </Link>

                            <button
                              onClick={handleSignOut}
                              className="w-full text-left px-4 py-2 text-sm text-ch-danger hover:bg-ch-surface-raised flex items-center gap-2 transition-colors duration-150"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 002 2h3a2 2 0 002-2V7a2 2 0 00-2-2h-3a2 2 0 00-2 2v1"
                                />
                              </svg>
                              Logout
                            </button>
                          </>
                        ) : (
                          <Link
                            to="/login"
                            className="block px-4 py-2 text-sm text-ch-muted hover:text-ch-text hover:bg-ch-surface-raised transition-colors duration-150"
                          >
                            Login
                          </Link>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>

          {/* Mobile menu panel */}
          <Disclosure.Panel className="sm:hidden border-t border-ch-border">
            <div className="space-y-1 px-3 pt-3 pb-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.to}
                  className={classNames(
                    location.pathname === item.to
                      ? "text-ch-accent bg-ch-surface"
                      : "text-ch-muted hover:text-ch-text hover:bg-ch-surface",
                    "block rounded-md px-3 py-2 text-base font-medium transition-colors"
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
