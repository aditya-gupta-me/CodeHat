import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock Firebase auth
const mockSignOut = vi.fn(() => Promise.resolve());
const mockCurrentUser = { uid: "test-uid" };

vi.mock("../../Firebase", () => ({
  auth: {
    currentUser: null,
    signOut: () => mockSignOut(),
  },
}));

// Import after mocks
const { detectFreshBrowserSession, cleanupSessionData, handleLogout } =
  await import("../../utils/sessionUtils");

describe("sessionUtils", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
    localStorage.clear();
  });

  describe("detectFreshBrowserSession", () => {
    it("sets sessionStart and appInitialized on truly fresh session", () => {
      detectFreshBrowserSession();

      expect(sessionStorage.getItem("sessionStart")).not.toBeNull();
      expect(sessionStorage.getItem("appInitialized")).toBe("true");
    });

    it("sets appInitialized when session exists but app not initialized", () => {
      sessionStorage.setItem("sessionStart", Date.now().toString());

      detectFreshBrowserSession();

      expect(sessionStorage.getItem("appInitialized")).toBe("true");
    });

    it("does nothing if both sessionStart and appInitialized already set", () => {
      sessionStorage.setItem("sessionStart", Date.now().toString());
      sessionStorage.setItem("appInitialized", "true");

      detectFreshBrowserSession();

      // Values remain but no errors thrown
      expect(sessionStorage.getItem("sessionStart")).not.toBeNull();
      expect(sessionStorage.getItem("appInitialized")).toBe("true");
    });
  });

  describe("cleanupSessionData", () => {
    it("removes all session-related storage items", () => {
      sessionStorage.setItem("sessionOnly", "true");
      sessionStorage.setItem("sessionStart", Date.now().toString());
      sessionStorage.setItem("appInitialized", "true");

      cleanupSessionData();

      expect(sessionStorage.getItem("sessionOnly")).toBeNull();
      expect(sessionStorage.getItem("sessionStart")).toBeNull();
      expect(sessionStorage.getItem("appInitialized")).toBeNull();
    });
  });

  describe("handleLogout", () => {
    it("cleans up session data and removes rememberMeData", () => {
      sessionStorage.setItem("sessionOnly", "true");
      localStorage.setItem("rememberMeData", "some-data");

      handleLogout();

      expect(sessionStorage.getItem("sessionOnly")).toBeNull();
      expect(localStorage.getItem("rememberMeData")).toBeNull();
    });

    it("calls auth.signOut", () => {
      handleLogout();

      expect(mockSignOut).toHaveBeenCalled();
    });
  });
});
