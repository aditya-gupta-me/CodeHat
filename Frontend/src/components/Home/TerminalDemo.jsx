import { useState, useEffect, useRef } from "react";

const CODE_LINES = [
  { text: "# AI Challenge · Today · Medium", color: "text-ch-muted" },
  { text: "# Sliding Window Maximum", color: "text-ch-muted" },
  { text: "", color: "" },
  { text: "from collections import deque", color: "text-ch-text" },
  { text: "", color: "" },
  { text: "def max_window(nums, k):", color: "text-ch-text" },
  { text: "    q, res = deque(), []", color: "text-ch-text" },
  { text: "    for i, n in enumerate(nums):", color: "text-ch-text" },
  { text: "        while q and nums[q[-1]] < n:", color: "text-ch-text" },
  { text: "            q.pop()", color: "text-ch-text" },
  { text: "        q.append(i)", color: "text-ch-text" },
  { text: "        if q[0] < i - k + 1: q.popleft()", color: "text-ch-text" },
  { text: "        if i >= k - 1:", color: "text-ch-text" },
  { text: "    res.append(nums[q[0]])", color: "text-ch-text" },
  { text: "    return res", color: "text-ch-text" },
];

const RESULT_LINE = "✓ All 12 tests passed · Runtime: 48ms";

/**
 * Animated terminal component that types out code lines one by one.
 * Matches the mockup's terminal-style code demo with traffic light dots.
 */
export default function TerminalDemo() {
  const [visibleLines, setVisibleLines] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setVisibleLines((prev) => {
        if (prev >= CODE_LINES.length) {
          clearInterval(intervalRef.current);
          setTimeout(() => setShowResult(true), 600);
          return prev;
        }
        return prev + 1;
      });
    }, 180);

    return () => clearInterval(intervalRef.current);
  }, []);

  /**
   * Apply basic Python syntax highlighting to a line of code.
   */
  const highlightSyntax = (text) => {
    if (!text) return <>&nbsp;</>;
    if (text.startsWith("#")) return <span className="text-ch-muted italic">{text}</span>;

    const keywords = /\b(from|import|def|for|in|while|and|if|return)\b/g;
    const numbers = /\b(\d+)\b/g;
    const functions = /\b(enumerate|deque|append|pop|popleft)\b/g;

    const parts = text.split(/(from|import|def|for|in|while|and|if|return|\d+|enumerate|deque|append|pop|popleft)/g);

    return parts.map((part, i) => {
      if (keywords.test(part)) {
        keywords.lastIndex = 0;
        return <span key={i} className="text-purple-400 font-semibold">{part}</span>;
      }
      if (functions.test(part)) {
        functions.lastIndex = 0;
        return <span key={i} className="text-yellow-300">{part}</span>;
      }
      if (numbers.test(part)) {
        numbers.lastIndex = 0;
        return <span key={i} className="text-orange-400">{part}</span>;
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className="card-surface overflow-hidden shadow-2xl shadow-black/30">
      {/* Traffic light bar */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-ch-border">
        <span className="w-3 h-3 rounded-full bg-red-500" />
        <span className="w-3 h-3 rounded-full bg-yellow-500" />
        <span className="w-3 h-3 rounded-full bg-green-500" />
        <span className="ml-3 text-xs font-code text-ch-muted">ai_challenge.py</span>
      </div>

      {/* Code area */}
      <div className="p-5 font-code text-sm leading-relaxed min-h-[320px]">
        {CODE_LINES.slice(0, visibleLines).map((line, i) => (
          <div key={i} className={`${line.color} whitespace-pre`}>
            {highlightSyntax(line.text)}
          </div>
        ))}

        {/* Blinking cursor */}
        {visibleLines < CODE_LINES.length && (
          <span className="inline-block w-2 h-4 bg-ch-accent animate-pulse" />
        )}

        {/* Result line */}
        {showResult && (
          <div className="mt-4 pt-3 border-t border-ch-border text-ch-success font-code text-sm animate-fade-in">
            {RESULT_LINE}
          </div>
        )}
      </div>
    </div>
  );
}
