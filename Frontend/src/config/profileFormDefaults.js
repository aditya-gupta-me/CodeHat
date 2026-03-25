/**
 * Default form state and empty entry templates for the profile form.
 * Shared between CreateProfile and EditProfile.
 */

export const EMPTY_EXPERIENCE = {
  title: "",
  company: "",
  startDate: "",
  endDate: "",
  isCurrent: false,
  description: "",
};

export const EMPTY_EDUCATION = {
  degree: "",
  institution: "",
  startDate: "",
  endDate: "",
  isOngoing: false,
  description: "",
};

export const DEFAULT_FORM_DATA = {
  C_Name: "",
  C_FName: "",
  C_LName: "",
  C_Email: "",
  C_PhoneNo: "",
  C_Gender: "",
  C_DOB: "",
  C_Address: "",
  C_TagLine: "",
  C_Description: "",
  C_Github: "",
  C_LinkedIn: "",
  C_Experience: [{ ...EMPTY_EXPERIENCE }],
  C_Education: [{ ...EMPTY_EDUCATION }],
  C_Website: "",
  C_Status: true,
  C_DOJ: new Date().toISOString(),
};
