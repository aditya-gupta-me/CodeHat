import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import NoLoginError from "../../errors/NoLoginError";
import { ScaleLoader } from "react-spinners";
import DisplayQuotes from "../../components/LoadingScreen/DisplayQuotes";

function PracticePage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [problems, setProblems] = useState([]);
  const backend_api = import.meta.env.VITE_BACKEND_API;

  useEffect(() => {
    if (user) {
      fetchProblems().finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const fetchProblems = async () => {
    try {
      const response = await fetch(`${backend_api}/api/problems`);
      const data = await response.json();
      setProblems(data);
    } catch {
      // Error fetching problems - will show empty list
    }
  };

  const getDifficultyBadge = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "badge-easy";
      case "Medium":
        return "badge-medium";
      case "Hard":
        return "badge-hard";
      default:
        return "badge-easy";
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-ch-dark">
        <ScaleLoader color="#00e5a0" loading={isLoading} />
        <DisplayQuotes />
      </div>
    );
  }

  if (!user) {
    return <NoLoginError />;
  }

  return (
    <div className="min-h-screen bg-ch-dark">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-ch-text mb-2">
            Practice Problems
          </h1>
          <p className="text-ch-muted">
            Sharpen your skills with AI-generated challenges
          </p>
        </div>

        {/* Problem cards / table */}
        <div className="card-surface overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-ch-border">
                <th className="text-left px-6 py-4 text-xs font-code uppercase tracking-wider text-ch-muted">
                  #ID
                </th>
                <th className="text-left px-6 py-4 text-xs font-code uppercase tracking-wider text-ch-muted">
                  Title
                </th>
                <th className="text-left px-6 py-4 text-xs font-code uppercase tracking-wider text-ch-muted">
                  Solution
                </th>
                <th className="text-left px-6 py-4 text-xs font-code uppercase tracking-wider text-ch-muted">
                  Difficulty
                </th>
              </tr>
            </thead>
            <tbody>
              {problems.length > 0 ? (
                problems.map((problem) => (
                  <tr
                    key={problem._id}
                    className="border-b border-ch-border/50 hover:bg-ch-surface-raised transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-code text-ch-muted">
                      {problem.problemId}
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        to={`/solve/${problem._id}`}
                        className="text-ch-text hover:text-ch-accent transition-colors font-medium"
                      >
                        {problem.title}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                          problem.solutionLink
                            ? "bg-ch-success/20 text-ch-success"
                            : "bg-ch-danger/20 text-ch-danger"
                        }`}
                      >
                        {problem.solutionLink ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={getDifficultyBadge(problem.difficulty)}>
                        {problem.difficulty}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-12 text-center text-ch-muted"
                  >
                    No problems available yet. Check back soon!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default PracticePage;
