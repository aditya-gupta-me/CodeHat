import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import useProfileForm, {
  getCurrentDate,
  getMinEndDate,
  formatDateForInput,
} from "../../hooks/useProfileForm";

describe("useProfileForm", () => {
  // --- Utility function tests ---

  describe("getCurrentDate", () => {
    it("returns today's date in YYYY-MM-DD format", () => {
      const result = getCurrentDate();
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  describe("getMinEndDate", () => {
    it("returns empty string for empty input", () => {
      expect(getMinEndDate("")).toBe("");
    });

    it("returns the day after the given start date", () => {
      expect(getMinEndDate("2024-01-15")).toBe("2024-01-16");
    });
  });

  describe("formatDateForInput", () => {
    it("returns empty string for empty input", () => {
      expect(formatDateForInput("")).toBe("");
    });

    it("formats an ISO date string to YYYY-MM-DD", () => {
      const result = formatDateForInput("2024-03-15T10:30:00.000Z");
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  // --- Hook state tests ---

  describe("initial state", () => {
    it("creates default empty form data when no initial data is provided", () => {
      const { result } = renderHook(() => useProfileForm());
      expect(result.current.formData.C_Name).toBe("");
      expect(result.current.formData.C_FName).toBe("");
      expect(result.current.formData.C_Experience).toHaveLength(1);
      expect(result.current.formData.C_Education).toHaveLength(1);
      expect(result.current.errors).toEqual({});
    });

    it("pre-fills form data when initial data is provided", () => {
      const initialData = {
        C_Name: "John Doe",
        C_FName: "John",
        C_LName: "Doe",
        C_Email: "john@example.com",
        C_PhoneNo: "1234567890",
        C_DOB: "1995-06-15",
        C_TagLine: "Developer",
        C_Description: "A developer",
      };

      const { result } = renderHook(() => useProfileForm(initialData));
      expect(result.current.formData.C_Name).toBe("John Doe");
      expect(result.current.formData.C_FName).toBe("John");
      expect(result.current.formData.C_Email).toBe("john@example.com");
    });
  });

  // --- Input handler tests ---

  describe("handleInputChange", () => {
    it("updates a text field", () => {
      const { result } = renderHook(() => useProfileForm());

      act(() => {
        result.current.handleInputChange({
          target: { name: "C_Name", value: "Jane Doe", type: "text" },
        });
      });

      expect(result.current.formData.C_Name).toBe("Jane Doe");
    });

    it("clears an error when the field is updated", () => {
      const { result } = renderHook(() => useProfileForm());

      // Trigger validation to create errors
      act(() => {
        result.current.validateForm();
      });

      expect(result.current.errors.C_Name).toBeTruthy();

      // Update the field
      act(() => {
        result.current.handleInputChange({
          target: { name: "C_Name", value: "Jane", type: "text" },
        });
      });

      expect(result.current.errors.C_Name).toBe("");
    });
  });

  // --- Experience management ---

  describe("experience management", () => {
    it("adds a new experience entry", () => {
      const { result } = renderHook(() => useProfileForm());

      act(() => {
        result.current.addExperience();
      });

      expect(result.current.formData.C_Experience).toHaveLength(2);
    });

    it("removes an experience entry when there are multiple", () => {
      const { result } = renderHook(() => useProfileForm());

      act(() => {
        result.current.addExperience();
      });
      expect(result.current.formData.C_Experience).toHaveLength(2);

      act(() => {
        result.current.removeExperience(1);
      });
      expect(result.current.formData.C_Experience).toHaveLength(1);
    });

    it("does not remove the last experience entry", () => {
      const { result } = renderHook(() => useProfileForm());

      act(() => {
        result.current.removeExperience(0);
      });

      expect(result.current.formData.C_Experience).toHaveLength(1);
    });

    it("updates an experience field", () => {
      const { result } = renderHook(() => useProfileForm());

      act(() => {
        result.current.handleExperienceChange(0, "title", "Senior Dev");
      });

      expect(result.current.formData.C_Experience[0].title).toBe("Senior Dev");
    });
  });

  // --- Education management ---

  describe("education management", () => {
    it("adds a new education entry", () => {
      const { result } = renderHook(() => useProfileForm());

      act(() => {
        result.current.addEducation();
      });

      expect(result.current.formData.C_Education).toHaveLength(2);
    });

    it("does not remove the last education entry", () => {
      const { result } = renderHook(() => useProfileForm());

      act(() => {
        result.current.removeEducation(0);
      });

      expect(result.current.formData.C_Education).toHaveLength(1);
    });
  });

  // --- Validation ---

  describe("validateForm", () => {
    it("returns errors for empty required fields", () => {
      const { result } = renderHook(() => useProfileForm());

      let validationErrors;
      act(() => {
        validationErrors = result.current.validateForm();
      });

      expect(validationErrors).toHaveProperty("C_Name");
      expect(validationErrors).toHaveProperty("C_FName");
      expect(validationErrors).toHaveProperty("C_PhoneNo");
      expect(validationErrors).toHaveProperty("C_DOB");
      expect(validationErrors).toHaveProperty("C_TagLine");
      expect(validationErrors).toHaveProperty("C_Description");
    });

    it("returns no errors for valid data", () => {
      const initialData = {
        C_Name: "John Doe",
        C_FName: "John",
        C_LName: "Doe",
        C_Email: "john@example.com",
        C_PhoneNo: "1234567890",
        C_DOB: "1995-06-15",
        C_TagLine: "Full Stack Developer",
        C_Description: "An experienced developer",
      };

      const { result } = renderHook(() => useProfileForm(initialData));

      let validationErrors;
      act(() => {
        validationErrors = result.current.validateForm();
      });

      expect(Object.keys(validationErrors)).toHaveLength(0);
    });

    it("validates phone number format", () => {
      const initialData = {
        C_Name: "John",
        C_FName: "John",
        C_PhoneNo: "123",
        C_DOB: "1995-01-01",
        C_TagLine: "Dev",
        C_Description: "Dev",
      };

      const { result } = renderHook(() => useProfileForm(initialData));

      let validationErrors;
      act(() => {
        validationErrors = result.current.validateForm();
      });

      expect(validationErrors.C_PhoneNo).toContain("10-digit");
    });
  });

  // --- getCleanedData ---

  describe("getCleanedData", () => {
    it("filters out empty experience and education entries", () => {
      const { result } = renderHook(() => useProfileForm());

      // Default entries have empty titles/degrees, so they should be filtered out
      const cleaned = result.current.getCleanedData();
      expect(cleaned.C_Experience).toHaveLength(0);
      expect(cleaned.C_Education).toHaveLength(0);
    });

    it("keeps entries with content", () => {
      const { result } = renderHook(() => useProfileForm());

      act(() => {
        result.current.handleExperienceChange(0, "title", "Engineer");
        result.current.handleEducationChange(0, "degree", "B.Tech");
      });

      const cleaned = result.current.getCleanedData();
      expect(cleaned.C_Experience).toHaveLength(1);
      expect(cleaned.C_Education).toHaveLength(1);
    });
  });
});
