import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import TerminalDemo from "../components/Home/TerminalDemo";
import AiChallengeCard from "../components/Home/AiChallengeCard";

// Format large numbers into readable format (1234 -> 1.2K)
const formatNumber = (num) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
};

function LandingPage() {
  const { user } = useAuth();
  const API_URL = import.meta.env.VITE_BACKEND_API;

  const [visitorCount, setVisitorCount] = useState(null);
  const [codeExecutionCount, setCodeExecutionCount] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  // Track visitor and fetch platform stats
  useEffect(() => {
    const trackAndFetchStats = async () => {
      try {
        // Generate or retrieve unique visitor ID from localStorage
        let visitorId = localStorage.getItem("visitorId");
        if (!visitorId) {
          visitorId = `visitor_${Date.now()}_${Math.random()
            .toString(36)
            .substr(2, 9)}`;
          localStorage.setItem("visitorId", visitorId);
        }

        // Track this visitor
        await axios.post(`${API_URL}/api/track-visitor`, { visitorId });

        // Fetch both counts in parallel
        const [visitorRes, executionRes] = await Promise.all([
          axios.get(`${API_URL}/api/visitor-count`),
          axios.get(`${API_URL}/api/code-execution-count`),
        ]);

        setVisitorCount(visitorRes.data.count);
        setCodeExecutionCount(executionRes.data.linesExecuted);
      } catch (error) {
        console.error("Error fetching platform stats:", error);
      } finally {
        setStatsLoading(false);
      }
    };

    trackAndFetchStats();

    // Auto-refresh counts every 30 seconds
    const interval = setInterval(async () => {
      try {
        const [visitorRes, executionRes] = await Promise.all([
          axios.get(`${API_URL}/api/visitor-count`),
          axios.get(`${API_URL}/api/code-execution-count`),
        ]);
        setVisitorCount(visitorRes.data.count);
        setCodeExecutionCount(executionRes.data.linesExecuted);
      } catch {
        // Silently fail on refresh
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [API_URL]);

  return (
    <div className="min-h-screen bg-ch-dark">
      {/* ─── Hero Section ─── */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-12 lg:pt-24 lg:pb-20">
        {/* AI badge */}
        <div className="mb-8">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-ch-accent/10 border border-ch-accent/30 text-ch-accent text-sm font-code">
            <span className="w-2 h-2 rounded-full bg-ch-accent animate-pulse" />
            AI-powered challenges
          </span>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left: Copy */}
          <div>
            <p className="section-heading mb-4">Code · Compete · Grow</p>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-8">
              Practice{" "}
              <span className="block">deliberately.</span>
              <span className="block text-ch-accent">Compete</span>
              <span className="block">seriously.</span>
              <span className="block">Ship faster.</span>
            </h1>

            <p className="text-ch-muted text-lg leading-relaxed mb-10 max-w-lg">
              AI-generated challenges across 20+ languages.
              <br />
              Real-time feedback. No static problem banks —<br />
              every session is fresh.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Link
                to={user ? "/practice" : "/register"}
                className="btn-accent text-base"
              >
                {user ? "Start practicing" : "Start practicing"}
              </Link>
              <Link to="/practice" className="btn-outline text-base">
                Browse challenges
              </Link>
            </div>
          </div>

          {/* Right: Terminal Demo */}
          <div className="lg:mt-4">
            <TerminalDemo />
          </div>
        </div>
      </section>

      {/* ─── Stats Row ─── */}
      <section className="max-w-7xl mx-auto px-6 pb-12">
        <div className="flex flex-wrap gap-12 lg:gap-16">
          <StatItem value="20+" label="languages" />
          <StatItem value="AI" label="question gen" />
          <StatItem
            value={statsLoading ? null : formatNumber(visitorCount || 0)}
            label="visitors"
            loading={statsLoading}
          />
          <StatItem
            value={statsLoading ? null : formatNumber(codeExecutionCount || 0)}
            label="lines executed"
            loading={statsLoading}
          />
        </div>
      </section>

      {/* ─── Today's AI Challenge ─── */}
      <section className="max-w-7xl mx-auto px-6 pb-12">
        <AiChallengeCard />
      </section>

      {/* ─── Recent Challenges ─── */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <h2 className="section-heading">Recent Challenges</h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <ChallengeCard
            difficulty="Easy"
            title="Two Sum Variants"
            tags="Python · Hash Maps"
          />
          <ChallengeCard
            difficulty="Medium"
            title="Graph BFS Shortest Path"
            tags="C++ · Graphs"
          />
          <ChallengeCard
            difficulty="Hard"
            title="LRU Cache Implementation"
            tags="Java · Design"
          />
        </div>
      </section>
    </div>
  );
}

/**
 * Stat item shown in the stats row.
 */
function StatItem({ value, label, loading }) {
  return (
    <div>
      <div className="font-display text-3xl font-bold text-ch-text">
        {loading ? (
          <span className="inline-block w-16 h-8 bg-ch-surface-raised rounded animate-pulse" />
        ) : (
          value
        )}
      </div>
      <div className="font-code text-sm text-ch-muted mt-1">{label}</div>
    </div>
  );
}

/**
 * Challenge preview card shown in the "Recent Challenges" grid.
 */
function ChallengeCard({ difficulty, title, tags }) {
  const badgeClass =
    difficulty === "Easy"
      ? "badge-easy"
      : difficulty === "Medium"
        ? "badge-medium"
        : "badge-hard";

  return (
    <Link
      to="/practice"
      className="card-surface p-5 hover:border-ch-accent/40 transition-colors duration-200 group block"
    >
      <span className={badgeClass}>{difficulty}</span>
      <h3 className="font-body text-lg font-semibold text-ch-text mt-3 group-hover:text-ch-accent transition-colors">
        {title}
      </h3>
      <p className="font-code text-sm text-ch-muted mt-1">{tags}</p>
    </Link>
  );
}

export default LandingPage;
