import { getCurrentDate, getMinEndDate } from "../../hooks/useProfileForm";

/**
 * Professional Experience form section with dynamic add/remove entries.
 */
export default function ExperienceSection({
  experiences,
  errors,
  onAdd,
  onRemove,
  onChange,
}) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 space-y-2 sm:space-y-0">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center">
          <span className="text-green-500 mr-2">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h2zm4-3a1 1 0 00-1 1v1h2V4a1 1 0 00-1-1zM4 9a1 1 0 000 2v5a1 1 0 001 1h10a1 1 0 001-1v-5a1 1 0 000-2H4z"
                clipRule="evenodd"
              />
            </svg>
          </span>
          Professional Experience
        </h2>
        <button
          type="button"
          onClick={onAdd}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-200 flex items-center w-full sm:w-auto justify-center"
        >
          <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          Add Experience
        </button>
      </div>

      {errors.C_Experience && (
        <p className="text-red-500 text-sm mb-4">{errors.C_Experience}</p>
      )}

      <div className="space-y-6">
        {experiences.map((experience, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 relative">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-medium text-gray-700">Experience {index + 1}</h3>
              {experiences.length > 1 && (
                <button
                  type="button"
                  onClick={() => onRemove(index)}
                  className="text-red-500 hover:text-red-700 p-1"
                  title="Remove this experience"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              )}
            </div>

            {errors[`C_Experience_Date_${index}`] && (
              <p className="text-red-500 text-sm mb-2">
                {errors[`C_Experience_Date_${index}`]}
              </p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                <input
                  type="text"
                  value={experience.title}
                  onChange={(e) => onChange(index, "title", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                  placeholder="e.g., Senior Frontend Developer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                <input
                  type="text"
                  value={experience.company}
                  onChange={(e) => onChange(index, "company", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                  placeholder="e.g., Tech Company Inc."
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={experience.startDate || ""}
                    onChange={(e) => onChange(index, "startDate", e.target.value)}
                    max={getCurrentDate()}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input
                    type="date"
                    value={experience.endDate || ""}
                    onChange={(e) => onChange(index, "endDate", e.target.value)}
                    min={getMinEndDate(experience.startDate)}
                    max={getCurrentDate()}
                    disabled={experience.isCurrent}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 disabled:bg-gray-100"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id={`exp-current-${index}`}
                  checked={experience.isCurrent}
                  onChange={(e) => onChange(index, "isCurrent", e.target.checked)}
                  className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <label htmlFor={`exp-current-${index}`} className="ml-2 text-sm text-gray-700">
                  I currently work here
                </label>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={experience.description}
                  onChange={(e) => onChange(index, "description", e.target.value)}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                  placeholder="Describe your responsibilities and achievements..."
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
