import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./components/Layout/Layout";
import { ScaleLoader } from "react-spinners";

// Lazy-loaded route components
const LandingPage = lazy(() => import("./pages/LandingPage"));
const PageNotFound = lazy(() => import("./errors/PageNotFoundError"));
const Login = lazy(() => import("./pages/Auth/LoginPage"));
const ForgotPasswordPage = lazy(() => import("./pages/Auth/ForgotPasswordPage"));
const ResetPasswordConfirmation = lazy(() => import("./pages/Auth/ResetPasswordConfirmation"));
const Register = lazy(() => import("./pages/Auth/RegistrationPage"));
const VerifyEmailPage = lazy(() => import("./pages/Auth/VerifyEmail"));
const CreateProfile = lazy(() => import("./user-profile/CreateProfile"));
const PracticePage = lazy(() => import("./pages/Coding/PracticePage"));
const ParticipatePage = lazy(() => import("./pages/Coding/ParticipatePage"));
const UserProfile = lazy(() => import("./user-profile/UserProfile"));
const EditProfile = lazy(() => import("./user-profile/EditProfile"));
const PythonCompiler = lazy(() => import("./pages/Coding/PythonCompiler"));
const JavaCompiler = lazy(() => import("./pages/Coding/JavaCompiler"));
const AdminPanel = lazy(() => import("./admin/AdminPanel"));
const ProblemSolver = lazy(() => import("./pages/Coding/ProblemSolver"));
const ProblemSolution = lazy(() => import("./pages/Coding/ProblemSolution"));
const DeleteAccount = lazy(() => import("./pages/Auth/DeleteAccount"));
const Goodbye = lazy(() => import("./pages/Auth/Goodbye"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const Vision = lazy(() => import("./pages/Vision"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const AboutUs = lazy(() => import("./pages/AboutUs"));

function LoadingFallback() {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-slate-900">
      <ScaleLoader color="#38bdf8" />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password-confirmation" element={<ResetPasswordConfirmation />} />
              <Route path="/register" element={<Register />} />
              <Route path="/verify-email" element={<VerifyEmailPage />} />
              <Route path="/createprofile" element={<CreateProfile />} />
              <Route path="/practice" element={<PracticePage />} />
              <Route path="/participate" element={<ParticipatePage />} />
              <Route path="/userprofile" element={<UserProfile />} />
              <Route path="/updateprofile" element={<EditProfile />} />
              <Route path="/pythoncompiler" element={<PythonCompiler />} />
              <Route path="/javacompiler" element={<JavaCompiler />} />
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/solve/:id" element={<ProblemSolver />} />
              <Route path="/solve/:id/solution" element={<ProblemSolution />} />
              <Route path="/delete-account" element={<DeleteAccount />} />
              <Route path="/goodbye" element={<Goodbye />} />
              <Route path="/termsofservice" element={<TermsOfService />} />
              <Route path="/vision" element={<Vision />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="*" element={<PageNotFound />} />
            </Route>
          </Routes>
        </Suspense>
      </Router>
    </AuthProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
