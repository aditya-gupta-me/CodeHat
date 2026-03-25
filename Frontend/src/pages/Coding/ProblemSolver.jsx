// ProblemSolver.jsx
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
import PythonEditor from "../../components/CodeEditor/PythonEditor";
import { auth } from "../../Firebase";
import NoLoginError from "../../errors/NoLoginError";
import { css } from "@emotion/react";
import { ScaleLoader } from "react-spinners";
import DisplayQuotes from "../../components/LoadingScreen/DisplayQuotes";

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

const SafeMarkdown = ({ content }) => {
  const [renderError, setRenderError] = useState(false);

  if (renderError) {
    // Fallback to plain text with basic formatting
    return <div className="whitespace-pre-wrap">{content}</div>;
  }

  try {
    return (
      <ReactMarkdown
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            return !inline && match ? (
              <SyntaxHighlighter
                style={tomorrow}
                language={match[1]}
                PreTag="div"
                className="rounded-lg"
                {...props}
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
        }}
        onError={() => setRenderError(true)}
      >
        {content}
      </ReactMarkdown>
    );
  } catch (error) {
    console.error("ReactMarkdown error:", error);
    return <div className="whitespace-pre-wrap">{content}</div>;
  }
};

// Helper function to format values for display
const formatValue = (value) => {
  if (value === null || value === undefined) {
    return "null";
  }
  if (typeof value === "string") {
    return `"${value}"`;
  }
  if (typeof value === "object") {
    return JSON.stringify(value, null, 2);
  }
  return String(value);
};

// Helper function to format function signature
const formatFunctionSignature = (functionSignature, testCase) => {
  if (!functionSignature || !functionSignature.name) {
    return "def solution():";
  }

  const funcName = functionSignature.name;
  const params = functionSignature.parameters || [];

  if (params.length === 0 && testCase?.input) {
    // If no parameters defined but input exists, use input keys
    const inputKeys =
      typeof testCase.input === "object" ? Object.keys(testCase.input) : [];
    return `def ${funcName}(${inputKeys.join(", ")}):`;
  }

  const paramStrings = params.map((param) => `${param.name}: ${param.type}`);
  return `def ${funcName}(${paramStrings.join(", ")}):`;
};

function ProblemSolver() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [code, setCode] = useState("# Write your solution here\n\n");
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState([]);
  const [output, setOutput] = useState("");
  const [activeTab, setActiveTab] = useState("problem");
  const [rightPanelTab, setRightPanelTab] = useState("editor");
  const [customInput, setCustomInput] = useState("");
  const [customOutput, setCustomOutput] = useState("");
  const backend_api = import.meta.env.VITE_BACKEND_API;

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (authUser) => {
      if (authUser) {
        setUser(authUser);
        if (id) {
          await fetchProblem();
        }
      } else {
        setUser(null);
        setLoading(false);
      }
      setTimeout(() => {
        setIsLoadingAuth(false);
      }, 2000);
    });

    return () => unsubscribe();
  }, [id]);

  useEffect(() => {
    const handleError = (event) => {
      setError("React rendering error: " + event.error?.message);
    };

    window.addEventListener("error", handleError);
    return () => window.removeEventListener("error", handleError);
  }, []);

  const fetchProblem = async () => {
    if (!backend_api) {
      setError("Backend API not configured");
      setLoading(false);
      return;
    }

    if (!id) {
      setError("No problem ID provided");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${backend_api}/api/problems/${id}`);

      if (!response.ok) {
        throw new Error(`Problem not found (${response.status})`);
      }

      const data = await response.json();
      setProblem(data);

      // Set initial code template if available
      if (data.template) {
        setCode(data.template);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const runCode = async () => {
    if (!code.trim()) {
      alert("Please write some code first!");
      return;
    }

    setIsRunning(true);
    setCustomOutput("");
    setRightPanelTab("io");

    try {
      const response = await fetch(`${backend_api}/py`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: code + `\n\nprint(${customInput || '""'})`,
        }),
      });

      const result = await response.json();
      setCustomOutput(result.passOrFail || "No output");
    } catch (error) {
      setCustomOutput("Error: " + error.message);
    } finally {
      setIsRunning(false);
    }
  };

  const runTests = async () => {
    if (!problem?.testCases || problem.testCases.length === 0) {
      alert("No test cases available for this problem!");
      return;
    }

    setIsRunning(true);
    setTestResults([]);
    setRightPanelTab("io");

    try {
      const response = await fetch(`${backend_api}/api/problems/${id}/test`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      const result = await response.json();
      setTestResults(result.results || []);

      // Show success message if all tests pass
      const passedTests = result.results.filter((r) => r.passed).length;
      const totalTests = result.results.length;

      if (passedTests === totalTests) {
        alert(`🎉 All tests passed! (${passedTests}/${totalTests})`);
      } else {
        alert(`${passedTests}/${totalTests} tests passed. Keep trying!`);
      }
    } catch (error) {
      alert("Error running tests: " + error.message);
    } finally {
      setIsRunning(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Medium":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Hard":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-ch-dark text-ch-muted border-ch-border";
    }
  };

  if (isLoadingAuth) {
    return (
      <>
<div className="min-h-screen flex flex-col">
          <main className="flex-grow">
            <div className="flex justify-center items-center h-screen">
              <ScaleLoader
                css={override}
                size={100}
                color={"#123abc"}
                loading={isLoadingAuth}
              />
              <DisplayQuotes />
            </div>
          </main>
        </div>
</>
    );
  }

  if (!user) {
    return (
      <>
<div className="min-h-screen flex flex-col">
          <main className="flex-grow">
            <NoLoginError />
          </main>
        </div>
</>
    );
  }

  if (loading) {
    return (
      <>
<div className="min-h-screen bg-ch-dark flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-ch-accent border-t-transparent mx-auto mb-4"></div>
            <p className="text-ch-muted font-medium">Loading problem...</p>
          </div>
        </div>
</>
    );
  }

  if (error) {
    return (
      <>
<div className="min-h-screen bg-ch-dark flex items-center justify-center">
          <div className="text-center bg-ch-surface p-8 rounded-xl shadow-lg max-w-md">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-ch-text mb-2">Error</h2>
            <p className="text-ch-muted">{error}</p>
          </div>
        </div>
</>
    );
  }

  return (
    <>
<div className="min-h-screen bg-ch-dark">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-160px)]">
            {/* Left Panel - Problem Description */}
            <div className="bg-ch-surface rounded-xl shadow-sm border border-ch-border flex flex-col overflow-hidden">
              {/* Problem Header */}
              <div className="bg-ch-surface-raised p-6 border-b border-ch-border">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h1 className="text-xl font-bold text-ch-text mb-2">
                      {problem?.problemId || "N/A"}.{" "}
                      {problem?.title || "Untitled Problem"}
                    </h1>
                    <Link
                      to={`/solve/${id}/solution`}
                      className="text-sm text-ch-accent dark:text-ch-accent hover:underline mt-1 inline-block"
                    >
                      View Solution →
                    </Link>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium border ${getDifficultyColor(
                      problem?.difficulty || "Unknown"
                    )}`}
                  >
                    {problem?.difficulty || "Unknown"}
                  </span>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-ch-border bg-ch-dark">
                <button
                  onClick={() => setActiveTab("problem")}
                  className={`px-6 py-3 text-sm font-medium transition-all duration-200 ${
                    activeTab === "problem"
                      ? "border-b-2 border-ch-accent text-ch-accent bg-ch-surface"
                      : "text-ch-muted hover:text-ch-muted hover:bg-ch-surface-raised"
                  }`}
                >
                  Problem
                </button>
                <button
                  onClick={() => setActiveTab("testcases")}
                  className={`px-6 py-3 text-sm font-medium transition-all duration-200 ${
                    activeTab === "testcases"
                      ? "border-b-2 border-ch-accent text-ch-accent bg-ch-surface"
                      : "text-ch-muted hover:text-ch-muted hover:bg-ch-surface-raised"
                  }`}
                >
                  Test Cases
                </button>
                {problem?.hints &&
                  problem.hints.length > 0 &&
                  problem.hints[0] && (
                    <button
                      onClick={() => setActiveTab("hints")}
                      className={`px-6 py-3 text-sm font-medium transition-all duration-200 ${
                        activeTab === "hints"
                          ? "border-b-2 border-ch-accent text-ch-accent bg-ch-surface"
                          : "text-ch-muted hover:text-ch-muted hover:bg-ch-surface-raised"
                      }`}
                    >
                      Hints
                    </button>
                  )}
              </div>

              {/* Tab Content */}
              <div className="flex-1 overflow-y-auto">
                {activeTab === "problem" && (
                  <div className="p-6">
                    <div className="prose max-w-none prose-slate prose-headings:text-ch-text prose-p:text-ch-muted prose-code:text-ch-accent prose-code:bg-ch-surface-raised prose-code:px-1 prose-code:py-0.5 prose-code:rounded">
                      {problem?.description ? (
                        <div>
                          <SafeMarkdown content={problem.description} />
                        </div>
                      ) : (
                        <p className="text-ch-muted">
                          No description available
                        </p>
                      )}

                      {/* Function Signature */}
                      {problem?.functionSignature && (
                        <div className="mt-6 p-4 bg-ch-surface-raised rounded-lg border border-ch-accent/30">
                          <h3 className="text-lg font-semibold mb-3 text-ch-accent">
                            Function Signature:
                          </h3>
                          <pre className="bg-ch-surface p-3 rounded-md border border-ch-accent/30 text-sm font-mono text-ch-text overflow-x-auto">
                            {formatFunctionSignature(
                              problem.functionSignature,
                              problem.testCases?.[0]
                            )}
                          </pre>
                        </div>
                      )}

                      {problem?.constraints && (
                        <div className="mt-8 p-4 bg-ch-dark rounded-lg border border-ch-border">
                          <h3 className="text-lg font-semibold mb-3 text-ch-text">
                            Constraints:
                          </h3>
                          <SafeMarkdown content={problem.constraints} />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === "testcases" && (
                  <div className="p-6">
                    <h3 className="text-lg font-semibold mb-6 text-ch-text">
                      Sample Test Cases
                    </h3>
                    {problem?.testCases &&
                    Array.isArray(problem.testCases) &&
                    problem.testCases.length > 0 ? (
                      <div className="space-y-4">
                        {problem.testCases
                          .filter((tc) => tc && !tc.isHidden)
                          .map((testCase, index) => (
                            <div
                              key={index}
                              className="bg-ch-dark rounded-lg p-5 border border-ch-border"
                            >
                              <h4 className="font-semibold mb-4 text-ch-text">
                                Example {index + 1}:
                              </h4>
                              <div className="space-y-3">
                                <div>
                                  <label className="block text-sm font-medium text-ch-muted mb-2">
                                    Input:
                                  </label>
                                  <pre className="bg-ch-surface p-3 rounded-md border border-ch-border text-sm font-mono text-ch-text overflow-x-auto">
                                    {testCase?.input !== undefined
                                      ? formatValue(testCase.input)
                                      : "No input provided"}
                                  </pre>
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-ch-muted mb-2">
                                    Expected Output:
                                  </label>
                                  <pre className="bg-ch-surface p-3 rounded-md border border-ch-border text-sm font-mono text-ch-text overflow-x-auto">
                                    {testCase?.expectedOutput !== undefined
                                      ? formatValue(testCase.expectedOutput)
                                      : "No expected output"}
                                  </pre>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-ch-muted">No test cases available</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "hints" && (
                  <div className="p-6">
                    <h3 className="text-lg font-semibold mb-6 text-ch-text">
                      Hints
                    </h3>
                    {problem?.hints && problem.hints.length > 0 ? (
                      <div className="space-y-4">
                        {problem.hints
                          .filter((hint) => hint && hint.trim())
                          .map((hint, index) => (
                            <div
                              key={index}
                              className="bg-yellow-50 rounded-lg p-4 border border-yellow-200"
                            >
                              <div className="flex items-start">
                                <div className="flex-shrink-0">
                                  <svg
                                    className="w-5 h-5 text-yellow-600 mt-0.5"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                </div>
                                <div className="ml-3 flex-1">
                                  <p className="text-sm font-medium text-yellow-800">
                                    Hint {index + 1}:
                                  </p>
                                  <div className="mt-1 text-sm text-yellow-700">
                                    <SafeMarkdown content={hint} />
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-ch-muted">No hints available</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Right Panel - Code Editor with Tabs */}
            <div className="bg-ch-surface rounded-xl shadow-sm border border-ch-border flex flex-col overflow-hidden">
              {/* Header with Action Buttons */}
              <div className="bg-ch-surface border-b border-ch-border">
                <div className="flex items-center justify-between p-6 pb-0">
                  <h2 className="text-lg font-semibold text-ch-text">
                    Code Editor
                  </h2>
                  <div className="flex gap-3">
                    <button
                      onClick={runCode}
                      disabled={isRunning}
                      className="px-5 py-2.5 bg-ch-accent text-white rounded-lg hover:bg-ch-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-medium text-sm shadow-sm"
                    >
                      {isRunning ? "Running..." : "Run Code"}
                    </button>
                    <button
                      onClick={runTests}
                      disabled={isRunning}
                      className="px-5 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-medium text-sm shadow-sm"
                    >
                      {isRunning ? "Testing..." : "Run Tests"}
                    </button>
                  </div>
                </div>

                {/* Sub-tabs */}
                <div className="flex border-t border-ch-border mt-4">
                  <button
                    onClick={() => setRightPanelTab("editor")}
                    className={`px-6 py-3 text-sm font-medium transition-all duration-200 ${
                      rightPanelTab === "editor"
                        ? "border-b-2 border-ch-accent text-ch-accent bg-ch-surface"
                        : "text-ch-muted hover:text-ch-muted hover:bg-ch-surface-raised"
                    }`}
                  >
                    <svg
                      className="w-4 h-4 inline mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                      />
                    </svg>
                    Code Editor
                  </button>
                  <button
                    onClick={() => setRightPanelTab("io")}
                    className={`px-6 py-3 text-sm font-medium transition-all duration-200 relative ${
                      rightPanelTab === "io"
                        ? "border-b-2 border-ch-accent text-ch-accent bg-ch-surface"
                        : "text-ch-muted hover:text-ch-muted hover:bg-ch-surface-raised"
                    }`}
                  >
                    <svg
                      className="w-4 h-4 inline mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                    Input/Output
                    {testResults.length > 0 && (
                      <span className="ml-2 px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-medium">
                        {testResults.filter((r) => r.passed).length}/
                        {testResults.length}
                      </span>
                    )}
                  </button>
                </div>
              </div>

              {/* Tab Content */}
              <div className="flex-1 overflow-hidden">
                <div
                  className={`h-full overflow-auto ${
                    rightPanelTab === "editor" ? "block" : "hidden"
                  }`}
                >
                  <PythonEditor value={code} onChange={setCode} />
                </div>

                {rightPanelTab === "io" && (
                  <div className="h-full overflow-y-auto bg-ch-dark p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-ch-muted mb-2">
                          Custom Input:
                        </label>
                        <textarea
                          value={customInput}
                          onChange={(e) => setCustomInput(e.target.value)}
                          className="w-full p-3 border border-ch-border rounded-lg text-sm focus:ring-2 focus:ring-ch-accent focus:border-ch-accent transition-colors duration-200"
                          rows="8"
                          placeholder="Enter custom input here..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-ch-muted mb-2">
                          Output:
                        </label>
                        <div className="w-full p-3 border border-ch-border rounded-lg bg-ch-surface text-sm min-h-[200px] font-mono text-ch-text whitespace-pre-wrap">
                          {customOutput || (
                            <span className="text-ch-muted">
                              Output will appear here...
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Test Results */}
                    {testResults.length > 0 && (
                      <div className="border-t border-ch-border pt-6">
                        <h3 className="text-lg font-semibold mb-4 text-ch-text flex items-center">
                          <svg
                            className="w-5 h-5 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          Test Results:
                          <span className="ml-2 text-sm text-ch-muted">
                            ({testResults.filter((r) => r.passed).length} of{" "}
                            {testResults.length} passed)
                          </span>
                        </h3>
                        <div className="space-y-3">
                          {testResults.map((result, index) => (
                            <div
                              key={index}
                              className={`p-4 rounded-lg border ${
                                result.passed
                                  ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                                  : "bg-red-50 border-red-200 text-red-800"
                              }`}
                            >
                              <div className="flex justify-between items-center">
                                <span className="font-medium flex items-center">
                                  {result.passed ? (
                                    <svg
                                      className="w-4 h-4 mr-2"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  ) : (
                                    <svg
                                      className="w-4 h-4 mr-2"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  )}
                                  Test {index + 1}:{" "}
                                  {result.passed ? "PASSED" : "FAILED"}
                                </span>
                                <span className="text-sm opacity-75">
                                  {result.executionTime}ms
                                </span>
                              </div>
                              {!result.passed && (
                                <div className="mt-3 text-sm space-y-2">
                                  <div className="bg-ch-surface bg-opacity-50 p-3 rounded border-l-4 border-emerald-400">
                                    <strong className="text-emerald-700">
                                      Expected:
                                    </strong>
                                    <pre className="mt-1 text-emerald-800 font-mono text-xs">
                                      {result.expected}
                                    </pre>
                                  </div>
                                  <div className="bg-ch-surface bg-opacity-50 p-3 rounded border-l-4 border-red-400">
                                    <strong className="text-red-700">
                                      Got:
                                    </strong>
                                    <pre className="mt-1 text-red-800 font-mono text-xs">
                                      {result.actual}
                                    </pre>
                                  </div>
                                  {result.error && (
                                    <div className="bg-ch-surface bg-opacity-50 p-3 rounded border-l-4 border-orange-400">
                                      <strong className="text-orange-700">
                                        Error:
                                      </strong>
                                      <pre className="mt-1 text-orange-800 font-mono text-xs">
                                        {result.error}
                                      </pre>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
</>
  );
}

export default ProblemSolver;
