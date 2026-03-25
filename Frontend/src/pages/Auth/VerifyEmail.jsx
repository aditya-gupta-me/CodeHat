import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const VerifyEmailPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login");
    }, 5000); // 5 seconds

    return () => clearTimeout(timer); // Cleanup if component unmounts early
  }, [navigate]);

  return (
    <>
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 text-gray-800">
        <h1 className="text-2xl font-bold mb-4">Verify Your Email</h1>
        <p className="text-center max-w-md">
          We’ve sent a verification link to your email. Please check your inbox and verify your
          email before logging in.
        </p>
        <p className="mt-6 text-sm text-gray-600">
          Didn't get the email? Try checking your spam folder.
        </p>
        <p className="mt-4 text-sm text-blue-600 font-medium">
          Redirecting to login in 5 seconds...
        </p>
      </div>
    </>
  );
};

export default VerifyEmailPage;
