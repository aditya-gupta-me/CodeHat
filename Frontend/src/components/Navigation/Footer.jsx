import { Link } from "react-router-dom";

function Footer() {
  const GitHubURL = import.meta.env.VITE_GITHUB;
  const X_URL = import.meta.env.VITE_X;
  const StackOverflow_URL = import.meta.env.VITE_StackOverflow;
  const LinkedIn_URL = import.meta.env.VITE_LinkedIn;

  return (
    <footer className="bg-ch-surface border-t border-ch-border w-full mt-auto">
      <div className="mx-auto max-w-7xl px-6 py-12">
        {/* Main footer content */}
        <div className="md:flex md:justify-between">
          {/* Brand */}
          <div className="mb-8 md:mb-0">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-display font-bold text-ch-accent">
                CodeHat
              </span>
            </Link>
            <p className="mt-3 text-sm text-ch-muted max-w-xs">
              AI-powered coding platform. Practice deliberately, compete
              seriously, ship faster.
            </p>
          </div>

          {/* Footer link columns */}
          <div className="grid grid-cols-2 gap-8 sm:gap-12 sm:grid-cols-3">
            <div>
              <h2 className="section-heading mb-4">Resources</h2>
              <ul className="space-y-3 text-sm">
                <li>
                  <a
                    href="https://ocw.mit.edu/courses/6-0001-introduction-to-computer-science-and-programming-in-python-fall-2016/"
                    className="text-ch-muted hover:text-ch-accent transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Learn
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-ch-muted hover:text-ch-accent transition-colors"
                    title="Coming soon"
                  >
                    Community
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="section-heading mb-4">Company</h2>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link
                    to="/vision"
                    className="text-ch-muted hover:text-ch-accent transition-colors"
                  >
                    Vision
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about"
                    className="text-ch-muted hover:text-ch-accent transition-colors"
                  >
                    About Us
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="section-heading mb-4">Legal</h2>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link
                    to="/privacy"
                    className="text-ch-muted hover:text-ch-accent transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    to="/termsofservice"
                    className="text-ch-muted hover:text-ch-accent transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <hr className="my-8 border-ch-border" />

        {/* Bottom section */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-sm text-ch-muted">
            © {new Date().getFullYear()} CodeHat™. All Rights Reserved.
          </span>

          {/* Social links */}
          <div className="flex items-center space-x-5">
            <SocialLink href={GitHubURL} label="GitHub">
              <path
                fillRule="evenodd"
                d="M12.026 2c-5.509 0-9.974 4.465-9.974 9.974 0 4.406 2.857 8.145 6.821 9.465.499.09.679-.217.679-.481 0-.237-.008-.865-.011-1.696-2.775.602-3.361-1.338-3.361-1.338-.452-1.152-1.107-1.459-1.107-1.459-.905-.619.069-.605.069-.605 1.002.07 1.527 1.028 1.527 1.028.89 1.524 2.336 1.084 2.902.829.091-.645.351-1.085.635-1.334-2.214-.251-4.542-1.107-4.542-4.93 0-1.087.389-1.979 1.024-2.675-.101-.253-.446-1.268.099-2.64 0 0 .837-.269 2.742 1.021a9.6 9.6 0 0 1 2.496-.336 9.6 9.6 0 0 1 2.496.336c1.906-1.291 2.742-1.021 2.742-1.021.545 1.372.203 2.387.099 2.64.64.696 1.024 1.587 1.024 2.675 0 3.833-2.33 4.675-4.552 4.922.355.308.675.916.675 1.846 0 1.334-.012 2.41-.012 2.737 0 .267.178.577.687.479C19.146 20.115 22 16.379 22 11.974 22 6.465 17.535 2 12.026 2"
                clipRule="evenodd"
              />
            </SocialLink>
            <SocialLink href={LinkedIn_URL} label="LinkedIn">
              <path d="M20 3H4a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1M8.339 18.337H5.667v-8.59h2.672zM7.003 8.574a1.548 1.548 0 1 1 0-3.096 1.548 1.548 0 0 1 0 3.096m11.335 9.763h-2.669V14.16c0-.996-.018-2.277-1.388-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248h-2.667v-8.59h2.56v1.174h.037c.355-.675 1.227-1.387 2.524-1.387 2.704 0 3.203 1.778 3.203 4.092v4.71z" />
            </SocialLink>
            <SocialLink href={X_URL} label="X / Twitter">
              <path d="M13.68 10.62 20.24 3h-1.55L13 9.62 8.45 3H3.19l6.88 10.01L3.19 21h1.55l6.01-6.99 4.8 6.99h5.24l-7.13-10.38Zm-2.13 2.47-.7-1-5.54-7.93H7.7l4.47 6.4.7 1 5.82 8.32H16.3z" />
            </SocialLink>
            <SocialLink href={StackOverflow_URL} label="StackOverflow">
              <path d="M17.24 19.399v-4.804h1.6V21H4.381v-6.405h1.598v4.804zM7.582 17.8h8.055v-1.604H7.582zm.195-3.64 7.859 1.641.34-1.552-7.861-1.642zm1.018-3.794 7.281 3.398.678-1.463-7.281-3.399-.678 1.454zm2.037-3.589 6.166 5.142 1.018-1.216-6.162-5.14-1.016 1.213zm3.982-3.778-1.311.969 4.803 6.454 1.313-.971-4.807-6.452z" />
            </SocialLink>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({ href, label, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-ch-muted hover:text-ch-accent transition-colors"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-5 h-5"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        {children}
      </svg>
      <span className="sr-only">{label}</span>
    </a>
  );
}

export default Footer;
