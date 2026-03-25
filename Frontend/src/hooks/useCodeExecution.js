import { useState, useCallback } from "react";
import axios from "axios";
import { saveAs } from "file-saver";

const BACKEND_API = import.meta.env.VITE_BACKEND_API;

/**
 * Custom hook that encapsulates all code execution logic
 * shared between Python and Java compiler pages.
 *
 * @param {Object} config - Language-specific configuration
 * @param {string} config.initialCode - Default code snippet for the editor
 * @param {string} config.endpoint - Backend API endpoint path (e.g. "/py")
 * @param {string} config.runningMessage - Message shown while code is executing
 * @param {Function} config.parseResponse - Extracts output string from the API response
 */
export default function useCodeExecution({ initialCode, endpoint, runningMessage, parseResponse }) {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState("");
  const [inputs, setInputs] = useState([""]);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    setOutput(runningMessage);
    try {
      const nonEmptyInputs = inputs.filter((input) => input.trim() !== "");
      const { data } = await axios.post(`${BACKEND_API}${endpoint}`, {
        code,
        inputs: nonEmptyInputs,
      });
      setOutput(parseResponse(data));
    } catch (error) {
      if (error.response?.data?.error) {
        setOutput(`Error: ${error.response.data.error}`);
      } else {
        setOutput("Error: Could not connect to the server. Please try again later.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyOutputToClipboard = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
    } catch {
      // Fallback: silently fail
    }
  };

  const downloadOutput = () => {
    if (!output) return;
    const blob = new Blob([output], { type: "text/plain;charset=utf-8" });
    saveAs(blob, "output.txt");
  };

  return {
    code,
    output,
    inputs,
    isSubmitting,
    handleCodeChange,
    handleInputChange,
    addInputField,
    removeInputField,
    clearAllInputs,
    submitCode,
    copyOutputToClipboard,
    downloadOutput,
  };
}
