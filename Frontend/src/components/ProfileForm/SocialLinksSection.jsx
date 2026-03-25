/**
 * Social Links & Portfolio form section for the profile form.
 * Renders GitHub, LinkedIn, and Website URL fields.
 */
export default function SocialLinksSection({ formData, onChange }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <span className="text-green-500 mr-2">
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5z"
              clipRule="evenodd"
            />
            <path
              fillRule="evenodd"
              d="M7.414 15.414a2 2 0 01-2.828-2.828l3-3a2 2 0 012.828 0 1 1 0 001.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 00-1.414-1.414l-1.5 1.5z"
              clipRule="evenodd"
            />
          </svg>
        </span>
        Social Links & Portfolio
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">GitHub Profile</label>
          <input
            type="url"
            name="C_Github"
            value={formData.C_Github}
            onChange={onChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
            placeholder="https://github.com/yourusername"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn Profile</label>
          <input
            type="url"
            name="C_LinkedIn"
            value={formData.C_LinkedIn}
            onChange={onChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
            placeholder="https://linkedin.com/in/yourusername"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Portfolio/Personal Website
          </label>
          <input
            type="url"
            name="C_Website"
            value={formData.C_Website || formData.C_FullInfo || ""}
            onChange={onChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
            placeholder="https://yourportfolio.com"
          />
        </div>
      </div>
    </div>
  );
}
