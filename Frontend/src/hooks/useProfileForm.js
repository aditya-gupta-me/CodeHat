import { useState } from "react";
import {
  EMPTY_EXPERIENCE,
  EMPTY_EDUCATION,
  DEFAULT_FORM_DATA,
} from "../config/profileFormDefaults";

/**
 * Get current date in YYYY-MM-DD format for date input constraints.
 */
export function getCurrentDate() {
  return new Date().toISOString().split("T")[0];
}

/**
 * Get the minimum allowed end date (one day after the given start date).
 */
export function getMinEndDate(startDate) {
  if (!startDate) return "";
  const date = new Date(startDate);
  date.setDate(date.getDate() + 1);
  return date.toISOString().split("T")[0];
}

/**
 * Format a date string (from MongoDB or ISO) to YYYY-MM-DD for date inputs.
 */
export function formatDateForInput(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

/**
 * Custom hook that manages profile form state, handlers, and validation.
 * Shared between CreateProfile and EditProfile pages.
 *
 * @param {Object} [initialData] - Optional pre-filled data (for editing)
 * @returns {Object} Form state, handlers, and validation function
 */
export default function useProfileForm(initialData) {
  const [formData, setFormData] = useState(() => {
    if (!initialData) return { ...DEFAULT_FORM_DATA };

    // Pre-fill from existing profile data (edit mode)
    return {
      C_Name: initialData.C_Name || "",
      C_FName: initialData.C_FName || "",
      C_LName: initialData.C_LName || "",
      C_Email: initialData.C_Email || "",
      C_PhoneNo: initialData.C_PhoneNo || "",
      C_Gender: initialData.C_Gender || "",
      C_DOB: initialData.C_DOB ? formatDateForInput(initialData.C_DOB) : "",
      C_Address: initialData.C_Address || "",
      C_TagLine: initialData.C_TagLine || "",
      C_Description: initialData.C_Description || "",
      C_Github: initialData.C_Github || "",
      C_LinkedIn: initialData.C_LinkedIn || "",
      C_FullInfo: initialData.C_FullInfo || "",
      C_Website: initialData.C_Website || "",
      C_Experience:
        initialData.C_Experience && initialData.C_Experience.length > 0
          ? initialData.C_Experience.map((exp) => ({
              ...exp,
              startDate: exp.startDate ? formatDateForInput(exp.startDate) : "",
              endDate: exp.endDate ? formatDateForInput(exp.endDate) : "",
            }))
          : [{ ...EMPTY_EXPERIENCE }],
      C_Education:
        initialData.C_Education && initialData.C_Education.length > 0
          ? initialData.C_Education.map((edu) => ({
              ...edu,
              startDate: edu.startDate ? formatDateForInput(edu.startDate) : "",
              endDate: edu.endDate ? formatDateForInput(edu.endDate) : "",
            }))
          : [{ ...EMPTY_EDUCATION }],
      C_Status: initialData.C_Status ?? true,
      C_DOJ: initialData.C_DOJ || new Date().toISOString(),
    };
  });

  const [errors, setErrors] = useState({});

  // --- Input handlers ---

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleExperienceChange = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      C_Experience: prev.C_Experience.map((exp, i) => {
        if (i !== index) return exp;
        const updated = { ...exp, [field]: value };
        // Clear end date if new start date is after existing end date
        if (field === "startDate" && exp.endDate && value && new Date(exp.endDate) <= new Date(value)) {
          updated.endDate = "";
        }
        return updated;
      }),
    }));
  };

  const handleEducationChange = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      C_Education: prev.C_Education.map((edu, i) => {
        if (i !== index) return edu;
        const updated = { ...edu, [field]: value };
        if (field === "startDate" && edu.endDate && value && new Date(edu.endDate) <= new Date(value)) {
          updated.endDate = "";
        }
        return updated;
      }),
    }));
  };

  // --- Add/Remove entries ---

  const addExperience = () => {
    setFormData((prev) => ({
      ...prev,
      C_Experience: [...prev.C_Experience, { ...EMPTY_EXPERIENCE }],
    }));
  };

  const removeExperience = (index) => {
    if (formData.C_Experience.length > 1) {
      setFormData((prev) => ({
        ...prev,
        C_Experience: prev.C_Experience.filter((_, i) => i !== index),
      }));
    }
  };

  const addEducation = () => {
    setFormData((prev) => ({
      ...prev,
      C_Education: [...prev.C_Education, { ...EMPTY_EDUCATION }],
    }));
  };

  const removeEducation = (index) => {
    if (formData.C_Education.length > 1) {
      setFormData((prev) => ({
        ...prev,
        C_Education: prev.C_Education.filter((_, i) => i !== index),
      }));
    }
  };

  // --- Validation ---

  const validateForm = () => {
    const newErrors = {};

    if (!formData.C_Name.trim()) newErrors.C_Name = "Full name is required";
    if (!formData.C_FName.trim()) newErrors.C_FName = "First name is required";
    if (!formData.C_PhoneNo.toString().trim())
      newErrors.C_PhoneNo = "Phone number is required";
    if (!formData.C_DOB) newErrors.C_DOB = "Date of birth is required";
    if (!formData.C_TagLine.trim()) newErrors.C_TagLine = "Tag line is required";
    if (!formData.C_Description.trim())
      newErrors.C_Description = "Professional summary is required";

    // Email validation (if provided)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.C_Email && !emailRegex.test(formData.C_Email))
      newErrors.C_Email = "Please enter a valid email address";

    // Phone validation
    const phoneRegex = /^\d{10}$/;
    if (
      formData.C_PhoneNo &&
      !phoneRegex.test(formData.C_PhoneNo.toString().replace(/\D/g, ""))
    )
      newErrors.C_PhoneNo = "Please enter a valid 10-digit phone number";

    // Date validations for experience
    formData.C_Experience.forEach((exp, idx) => {
      if (exp.startDate && exp.endDate && !exp.isCurrent) {
        if (new Date(exp.startDate) >= new Date(exp.endDate)) {
          newErrors[`C_Experience_Date_${idx}`] =
            `End date must be after start date for experience ${idx + 1}`;
        }
      }
    });

    // Date validations for education
    formData.C_Education.forEach((edu, idx) => {
      if (edu.startDate && edu.endDate && !edu.isOngoing) {
        if (new Date(edu.startDate) >= new Date(edu.endDate)) {
          newErrors[`C_Education_Date_${idx}`] =
            `End date must be after start date for education ${idx + 1}`;
        }
      }
    });

    setErrors(newErrors);
    return newErrors;
  };

  /**
   * Clean form data for submission — removes empty experience/education entries.
   */
  const getCleanedData = () => ({
    ...formData,
    C_Experience: formData.C_Experience.filter((exp) => exp.title.trim()),
    C_Education: formData.C_Education.filter((edu) => edu.degree.trim()),
  });

  /**
   * Scroll to the first validation error on the page.
   */
  const scrollToFirstError = (validationErrors) => {
    const firstErrorKey = Object.keys(validationErrors)[0];
    if (firstErrorKey) {
      const el = document.querySelector(`[name="${firstErrorKey}"]`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return {
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
  };
}
