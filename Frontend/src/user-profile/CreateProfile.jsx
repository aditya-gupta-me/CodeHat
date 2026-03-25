import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { ScaleLoader } from "react-spinners";

import { auth, db } from "../Firebase";
import { useAuth } from "../context/AuthContext";
import useProfileForm from "../hooks/useProfileForm";
import NoUserError from "../errors/NoUserError";
import BasicInfoSection from "../components/ProfileForm/BasicInfoSection";
import SocialLinksSection from "../components/ProfileForm/SocialLinksSection";
import ExperienceSection from "../components/ProfileForm/ExperienceSection";
import EducationSection from "../components/ProfileForm/EducationSection";

const ProfileCreationPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const backend_api = import.meta.env.VITE_BACKEND_API;

  const {
    formData,
    setFormData,
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
  } = useProfileForm();

  // Pre-fill email from auth and check if profile already exists
  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setIsLoading(false);
      return;
    }

    setFormData((prev) => ({ ...prev, C_Email: user.email }));

    const checkExistingProfile = async () => {
      try {
        const token = await user.getIdToken();
        const response = await fetch(`${backend_api}/user/profile`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.status === 200) {
          const existingProfile = await response.json();
          if (existingProfile) {
            alert("Profile already created!");
            navigate("/updateprofile", { state: existingProfile });
          }
        }
      } catch {
        // Profile doesn't exist yet — that's expected
      } finally {
        setIsLoading(false);
      }
    };

    checkExistingProfile();
  }, [user, authLoading, backend_api, navigate, setFormData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      scrollToFirstError(validationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const token = await user.getIdToken();
      const cleanedData = getCleanedData();

      const response = await fetch(`${backend_api}/users`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cleanedData),
      });

      if (response.ok) {
        // Mark full profile as complete in Firestore
        try {
          await setDoc(
            doc(db, "users", user.uid),
            {
              fullProfileComplete: true,
              profileUpdatedAt: new Date().toISOString(),
            },
            { merge: true }
          );
        } catch (firestoreError) {
          console.error("Error updating Firestore:", firestoreError);
          // Don't block the success flow
        }

        alert("Profile created successfully!");
        navigate("/userprofile");
      } else {
        throw new Error("Failed to create profile");
      }
    } catch (error) {
      console.error("Error creating profile:", error);
      alert("Error creating profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || authLoading) {
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
          <h1 className="text-3xl font-bold text-white mb-2">Build Your Developer Profile</h1>
          <p className="text-white opacity-90">
            Showcase your skills and experience to the world
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

          {/* Submit Button */}
          <div className="flex justify-center pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-10 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Creating Profile..." : "Create Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileCreationPage;