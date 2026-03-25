import PythonEditor from "../components/CodeEditor/PythonEditor";
import JavaEditor from "../components/CodeEditor/JavaEditor";

/**
 * Language-specific configurations for the unified Compiler page.
 * Each config provides the initial code, API endpoint, editor component,
 * display name, running message, input hint text, and response parser.
 *
 * To add a new language, simply add a new entry here.
 */

// Helper: extract a cleaner error message from Python traceback output
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

const LANGUAGE_CONFIGS = {
  python: {
    name: "Python",
    title: "Python Playground",
    EditorComponent: PythonEditor,
    initialCode:
      "# Welcome to your Python sandbox!\n# Write your code and click 'Run Code' to see the magic.\n\nprint('Hello, professional coder!')",
    endpoint: "/py",
    runningMessage: "Running code...",
    inputHint: "Python",
    inputFunctionName: "input()",
    parseResponse: (data) => extractRelevantOutput(data.passOrFail),
  },
  java: {
    name: "Java",
    title: "Java Playground",
    EditorComponent: JavaEditor,
    initialCode: `// Welcome to your Java sandbox!
// Write your code and click 'Run Code' to see the magic.

public class HelloWorld {
  public static void main(String[] args) {
    System.out.println("Hello from Java!");
  }
}
`,
    endpoint: "/execute/java",
    runningMessage: "Compiling and running Java code...",
    inputHint: "Java",
    inputFunctionName: "Scanner",
    parseResponse: (data) => {
      if (data.success) {
        return data.output || "Code executed successfully with no output.";
      }
      return `Error:\n${data.error}`;
    },
  },
};

export default LANGUAGE_CONFIGS;
