import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor, act } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider, useAuth } from "../../context/AuthContext";

// Mock Firebase modules
const mockOnAuthStateChanged = vi.fn();
const mockSignOut = vi.fn(() => Promise.resolve());
const mockGetDoc = vi.fn();

vi.mock("firebase/auth", () => ({
  onAuthStateChanged: (...args) => mockOnAuthStateChanged(...args),
  signOut: (...args) => mockSignOut(...args),
  getAuth: vi.fn(),
}));

vi.mock("firebase/firestore", () => ({
  doc: vi.fn(),
  getDoc: (...args) => mockGetDoc(...args),
  getFirestore: vi.fn(),
}));

vi.mock("../../Firebase", () => ({
  auth: { currentUser: null },
  db: {},
}));

// Test component to consume auth context
function TestConsumer() {
  const { user, username, loading } = useAuth();
  return (
    <div>
      <span data-testid="loading">{loading.toString()}</span>
      <span data-testid="user">{user ? "logged-in" : "logged-out"}</span>
      <span data-testid="username">{username || "none"}</span>
    </div>
  );
}

function renderWithAuth() {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    </BrowserRouter>
  );
}

describe("AuthContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    sessionStorage.clear();

    // Default: no user signed in
    mockOnAuthStateChanged.mockImplementation((auth, callback) => {
      callback(null);
      return vi.fn(); // unsubscribe function
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("provides loading=true initially and then resolves", async () => {
    renderWithAuth();

    await waitFor(() => {
      expect(screen.getByTestId("loading")).toHaveTextContent("false");
    });
  });

  it("sets user to null when no user is signed in", async () => {
    renderWithAuth();

    await waitFor(() => {
      expect(screen.getByTestId("user")).toHaveTextContent("logged-out");
      expect(screen.getByTestId("username")).toHaveTextContent("none");
    });
  });

  it("sets user when Firebase reports a signed-in user", async () => {
    const mockUser = { uid: "test-uid", email: "test@example.com" };

    mockOnAuthStateChanged.mockImplementation((auth, callback) => {
      callback(mockUser);
      return vi.fn();
    });

    mockGetDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({ username: "testuser" }),
    });

    renderWithAuth();

    await waitFor(() => {
      expect(screen.getByTestId("user")).toHaveTextContent("logged-in");
      expect(screen.getByTestId("username")).toHaveTextContent("testuser");
    });
  });

  it("falls back to email when no Firestore username exists", async () => {
    const mockUser = { uid: "test-uid", email: "test@example.com" };

    mockOnAuthStateChanged.mockImplementation((auth, callback) => {
      callback(mockUser);
      return vi.fn();
    });

    mockGetDoc.mockResolvedValue({
      exists: () => false,
    });

    renderWithAuth();

    await waitFor(() => {
      expect(screen.getByTestId("username")).toHaveTextContent(
        "test@example.com"
      );
    });
  });

  it("logs out user when remember-me data is expired", async () => {
    const mockUser = { uid: "test-uid", email: "test@example.com" };
    const fifteenDaysAgo = Date.now() - 15 * 24 * 60 * 60 * 1000;

    localStorage.setItem(
      "rememberMeData",
      JSON.stringify({ timestamp: fifteenDaysAgo, rememberMe: true })
    );

    mockOnAuthStateChanged.mockImplementation((auth, callback) => {
      callback(mockUser);
      return vi.fn();
    });

    mockGetDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({ username: "testuser" }),
    });

    renderWithAuth();

    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalled();
    });
  });

  it("throws error when useAuth is used outside AuthProvider", () => {
    // Suppress console.error for this test since React will log the error
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => {
      render(
        <BrowserRouter>
          <TestConsumer />
        </BrowserRouter>
      );
    }).toThrow("useAuth must be used within an AuthProvider");

    consoleSpy.mockRestore();
  });
});
