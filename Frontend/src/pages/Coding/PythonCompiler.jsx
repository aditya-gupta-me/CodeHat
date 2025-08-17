import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { saveAs } from "file-saver";
import copy from "copy-to-clipboard";
import { ScaleLoader } from "react-spinners";

import Header from "../../components/Navigation/Header";
import Footer from "../../components/Navigation/Footer";
import PythonEditor from "../../components/CodeEditor/PythonEditor";
import NoLoginError from "../../errors/NoLoginError";
import DisplayQuotes from "../../components/LoadingScreen/DisplayQuotes";
import { auth } from "../../Firebase";

// Helper function to extract a cleaner error message
function extractRelevantOutput(rawOutput) {
  if (!rawOutput) return "";
  if (rawOutput.includes("Traceback (most recent call last):")) {
    return rawOutput
      .split("\n")
      .filter((line) => line.trim() !== "")
      .pop();
  }
  return rawOutput.trim();
}

function PythonCompiler() {
  const initialCode =
    "# Welcome to your Python sandbox!\n# Write your code and click 'Run Code' to see the magic.\n\nprint('Hello, professional coder!')";

  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState("");
  const [inputs, setInputs] = useState([""]);
  const [user, setUser] = useState(null);
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const backend_api = import.meta.env.VITE_BACKEND_API;

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      setUser(authUser || null);
      setIsAuthenticating(false);
    });
    return () => unsubscribe();
  }, []);

  const handleCodeChange = useCallback((newCode) => {
    setCode(newCode);
  }, []);

  const handleInputChange = (index, value) => {
    const newInputs = [...inputs];
    newInputs[index] = value;
    setInputs(newInputs);
  };

  const addInputField = () => {
    setInputs([...inputs, ""]);
  };

  const removeInputField = (index) => {
    if (inputs.length > 1) {
      const newInputs = inputs.filter((_, i) => i !== index);
      setInputs(newInputs);
    }
  };

  const clearAllInputs = () => {
    setInputs([""]);
  };

  const submitCode = async () => {
    if (!code.trim()) {
      setOutput("Please write some code before submitting.");
      return;
    }
    setIsSubmitting(true);
    setOutput("Running code...");
    try {
      // Filter out empty inputs
      const nonEmptyInputs = inputs.filter(input => input.trim() !== "");
      
      const { data } = await axios.post(`${backend_api}/py`, { 
        code,
        inputs: nonEmptyInputs
      });
      const cleanOutput = extractRelevantOutput(data.passOrFail);
      setOutput(cleanOutput);
    } catch (error) {
      console.error("Error occurred:", error);
      setOutput(
        "Error: Could not connect to the server. Please try again later."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyOutputToClipboard = () => {
    if (!output) return;
    copy(output);
    alert("Output copied to clipboard!");
  };

  const downloadOutput = () => {
    if (!output) return;
    const blob = new Blob([output], { type: "text/plain;charset=utf-8" });
    saveAs(blob, "output.txt");
  };

  if (!user) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-900">
        <Header />
        <main className="flex-grow">
          <NoLoginError />
        </main>
        <Footer />
      </div>
    );
  }

  if (isAuthenticating) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-slate-900">
        <ScaleLoader color={"#38bdf8"} loading={isAuthenticating} />
        <DisplayQuotes />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-900 font-sans">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8">
        {/* Top Action Bar */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-100">Python Playground</h1>
          <button
            className="inline-flex items-center justify-center px-8 py-3 bg-blue-600 text-white font-medium rounded-lg shadow-lg transition-all duration-200 hover:bg-blue-700 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
            onClick={submitCode}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Running...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Run Code
              </>
            )}
          </button>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column - Code Editor (Takes up 2/3 on large screens) */}
          <div className="xl:col-span-2 space-y-6">
            {/* Code Editor */}
            <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden">
              <div className="bg-slate-700 px-6 py-3 border-b border-slate-600">
                <h2 className="text-lg font-semibold text-slate-100 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
                  </svg>
                  Code Editor
                </h2>
              </div>
              <div className="p-0">
                <PythonEditor value={code} onChange={handleCodeChange} />
              </div>
            </div>

            {/* Output Panel */}
            <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden">
              <div className="bg-slate-700 px-6 py-3 border-b border-slate-600 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-slate-100 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Output
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={copyOutputToClipboard}
                    disabled={!output}
                    className="px-3 py-1.5 text-sm font-medium bg-slate-600 text-slate-200 rounded-md hover:bg-slate-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                    </svg>
                    Copy
                  </button>
                  <button
                    onClick={downloadOutput}
                    disabled={!output}
                    className="px-3 py-1.5 text-sm font-medium bg-slate-600 text-slate-200 rounded-md hover:bg-slate-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    Save
                  </button>
                </div>
              </div>
              <div className="p-6">
                <pre className="w-full bg-slate-900 text-slate-300 rounded-lg p-4 min-h-[200px] whitespace-pre-wrap text-sm font-mono border border-slate-600">
                  {output || "Your code's output will appear here..."}
                </pre>
              </div>
            </div>
          </div>

          {/* Right Column - Input Panel (Takes up 1/3 on large screens) */}
          <div className="xl:col-span-1">
            <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden sticky top-6">
              <div className="bg-slate-700 px-6 py-3 border-b border-slate-600">
                <h3 className="text-lg font-semibold text-slate-100 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path>
                  </svg>
                  User Inputs
                </h3>
              </div>
              
              <div className="p-6">
                <div className="mb-4 flex gap-2">
                  <button
                    onClick={addInputField}
                    className="flex-1 px-3 py-2 text-sm font-medium bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors duration-200 flex items-center justify-center"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                    Add
                  </button>
                  <button
                    onClick={clearAllInputs}
                    className="flex-1 px-3 py-2 text-sm font-medium bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200 flex items-center justify-center"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                    Clear
                  </button>
                </div>
                
                <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                  Add inputs for your Python <code className="bg-slate-700 px-1 rounded text-slate-300">input()</code> functions. They'll be used in order.
                </p>
                
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {inputs.map((input, index) => (
                    <div key={index} className="group">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-slate-400">
                          Input #{index + 1}
                        </span>
                        {inputs.length > 1 && (
                          <button
                            onClick={() => removeInputField(index)}
                            className="opacity-0 group-hover:opacity-100 p-1 text-red-400 hover:text-red-300 transition-all duration-200"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                          </button>
                        )}
                      </div>
                      <input
                        type="text"
                        value={input}
                        onChange={(e) => handleInputChange(index, e.target.value)}
                        placeholder={`Value for input ${index + 1}`}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 text-sm"
                      />
                    </div>
                  ))}
                </div>
                
                {inputs.filter(i => i.trim()).length > 0 && (
                  <div className="mt-4 p-3 bg-slate-700 rounded-lg border border-slate-600">
                    <p className="text-xs text-slate-400 mb-2">Preview:</p>
                    <div className="space-y-1">
                      {inputs.filter(i => i.trim()).map((input, index) => (
                        <div key={index} className="text-xs text-slate-300 font-mono">
                          <span className="text-slate-500">#{index + 1}:</span> "{input}"
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default PythonCompiler;