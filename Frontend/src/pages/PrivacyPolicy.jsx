import Header from "../components/Navigation/Header";
import Footer from "../components/Navigation/Footer";

const PrivacyPolicy = () => {
  const email = import.meta.env.VITE_EMAIL;

  const handleDeleteClick = () => {
    window.location.href = "/delete-account";
  };

  return (
    <>
      <Header />
      <main className="bg-white min-h-screen py-16 px-6 font-inter text-gray-900">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
          <h2 className="text-gray-500 font-medium text-base mb-8 italic">
            Effective as of July 2025
          </h2>

          <p className="text-[0.95rem] leading-relaxed mb-4">
            At <span className="font-semibold">CodeHat</span>, we are committed
            to protecting your privacy. This Privacy Policy explains how we
            collect, use, and safeguard your personal information.
          </p>

          <hr className="my-5 border-gray-400" />

          <h3 className="text-lg font-semibold mb-2">
            1. Information We Collect
          </h3>
          <p className="text-[0.95rem] leading-relaxed mb-5">
            We collect only the information you provide directly to us, such as
            your name, email address, and any content you create on our
            platform. We do not collect IP addresses, browser types, or any
            other tracking data.
          </p>

          <h3 className="text-lg font-semibold mb-2">
            2. How We Use Your Information
          </h3>
          <p className="text-[0.95rem] leading-relaxed mb-5">
            We store your basic information (name, email, etc.) in our database
            solely to provide you with platform services and account
            functionality. We do not use your data for any malicious purposes,
            analytics, advertising, or sell your information to anyone.
          </p>

          <h3 className="text-lg font-semibold mb-2">
            3. Data Sharing and Disclosure
          </h3>
          <p className="text-[0.95rem] leading-relaxed mb-5">
            We do not share your data with any third-party service providers,
            advertisers, or partners. Your information remains private and is
            only accessed when necessary to provide you with platform services.
            We may only disclose information if required by law.
          </p>

          <h3 className="text-lg font-semibold mb-2">4. Data Security</h3>
          <p className="text-[0.95rem] leading-relaxed mb-5">
            Your data is secure with us. We use OAuth 2.0 for authentication,
            which means even our developers cannot see your password. Your
            authentication is handled securely through trusted OAuth providers,
            ensuring your credentials remain protected at all times.
          </p>

          <h3 className="text-lg font-semibold mb-2">5. Your Rights</h3>
          <p className="text-[0.95rem] leading-relaxed mb-5">
            You have the right to access, update, or delete your personal
            information at any time. You can manage your data through your
            account settings or by contacting us directly.
          </p>

          <h3 className="text-lg font-semibold mb-2">
            6. Cookies and Tracking
          </h3>
          <p className="text-[0.95rem] leading-relaxed mb-5">
            We do not currently use cookies or any tracking technologies on our
            platform. Your browsing activity and behavior are not monitored or
            tracked in any way.
          </p>

          <h3 className="text-lg font-semibold mb-2">
            7. Changes to This Policy
          </h3>
          <p className="text-[0.95rem] leading-relaxed mb-5">
            We may update this Privacy Policy from time to time. Any changes
            will be posted on this page, and we will notify you of significant
            updates through email or a platform notification.
          </p>

          <h3 className="text-lg font-semibold mb-2">8. Contact Us</h3>
          <p className="text-[0.95rem] leading-relaxed mb-5">
            If you have any questions or concerns about this Privacy Policy or
            how we handle your data, please contact us at{" "}
            <span className="italic">
              <a href={`mailto:${email}`}>{email}</a>
            </span>
            .
          </p>

          {/* Subtle data control button */}
          <div className="mt-8 text-center">
            <button
              onClick={handleDeleteClick}
              className="text-sm underline text-gray-600 hover:text-gray-900 transition"
              aria-label="Control your account data"
            >
              Control your account data
            </button>
          </div>

          <p className="text-sm text-gray-500 mt-10 italic">
            Last updated: November 2025
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default PrivacyPolicy;
