import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ScaleLoader } from "react-spinners";

import { useAuth } from "../context/AuthContext";
import useProfileForm from "../hooks/useProfileForm";
import NoUserError from "../errors/NoUserError";
import BasicInfoSection from "../components/ProfileForm/BasicInfoSection";
import SocialLinksSection from "../components/ProfileForm/SocialLinksSection";
import ExperienceSection from "../components/ProfileForm/ExperienceSection";
import EducationSection from "../components/ProfileForm/EducationSection";

const EditProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const backend_api = import.meta.env.VITE_BACKEND_API;

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with existing profile data from route state
  const {
    formData,
    errors,
    handleInputChange,
    handleExperienceChange,
    handleEducationChange,
    addExperience,
    removeExperience,
    addEducation,
    removeEducation,
    validateForm,
    getCleanedData,
    scrollToFirstError,
  } = useProfileForm(location.state);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      scrollToFirstError(validationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      if (!user) {
        alert("User not authenticated. Please log in again.");
        navigate("/login");
        return;
      }

      const idToken = await user.getIdToken();
      const cleanedData = {
        ...getCleanedData(),
        _id: location.state?._id,
      };

      const response = await fetch(`${backend_api}/users`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${idToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cleanedData),
      });

      if (response.ok) {
        alert("Profile updated successfully!");
        navigate("/userprofile");
      } else {
        if (response.status === 401) {
          alert("Authentication failed. Please log in again.");
          navigate("/login");
        } else {
          throw new Error("Failed to update profile");
        }
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/userprofile");
  };

  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ScaleLoader size={100} color={"#123abc"} loading={true} />
      </div>
    );
  }

  if (!user) {
    return <NoUserError />;
  }

  return (
    <div
      className="container mx-auto p-5 bg-gray-50 dark:bg-white px-4 lg:px-16"
      style={{
        backgroundImage: "linear-gradient(to right, #38a3a5, #57cc99)",
        color: "#fff",
      }}
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Update Your Developer Profile</h1>
          <p className="text-white opacity-90">
            Keep your professional information up to date
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <BasicInfoSection formData={formData} errors={errors} onChange={handleInputChange} />
          <SocialLinksSection formData={formData} onChange={handleInputChange} />
          <ExperienceSection
            experiences={formData.C_Experience}
            errors={errors}
            onAdd={addExperience}
            onRemove={removeExperience}
            onChange={handleExperienceChange}
          />
          <EducationSection
            education={formData.C_Education}
            errors={errors}
            onAdd={addEducation}
            onRemove={removeEducation}
            onChange={handleEducationChange}
          />

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 pt-4">
            <button
              type="button"
              onClick={handleCancel}
              className="px-8 py-3 bg-gray-500 hover:bg-gray-600 text-white font-bold rounded-lg shadow-lg transition duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-10 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Updating Profile..." : "Update Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
