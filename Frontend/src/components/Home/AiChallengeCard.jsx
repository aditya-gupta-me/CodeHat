import { Link } from "react-router-dom";

/**
 * "Today's AI Challenge" card shown on the homepage.
 * Drives daily return visits by surfacing the AI-generated challenge.
 */
export default function AiChallengeCard() {
  return (
    <div className="card-surface flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5">
      {/* Left: AI icon + challenge info */}
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-ch-accent/15 border border-ch-accent/30 flex items-center justify-center">
          <span className="font-code text-ch-accent font-bold text-sm">AI</span>
        </div>
        <div>
          <h3 className="text-ch-text font-semibold text-base">
            Today's AI Challenge — Sliding Window Maximum
          </h3>
          <p className="text-ch-muted text-sm font-code mt-0.5">
            <span className="badge-medium mr-1">Medium</span>
            {" · "}Python · Arrays · Generated 2h ago
          </p>
        </div>
      </div>

      {/* Right: CTA button */}
      <Link to="/practice" className="btn-accent whitespace-nowrap text-sm">
        Solve now
      </Link>
    </div>
  );
}
