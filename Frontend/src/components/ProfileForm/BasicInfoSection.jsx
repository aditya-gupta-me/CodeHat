import { getCurrentDate } from "../../hooks/useProfileForm";

/**
 * Basic Information form section for the profile form.
 * Renders name, tagline, email, phone, gender, DOB, address, and summary fields.
 */
export default function BasicInfoSection({ formData, errors, onChange }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <span className="text-green-500 mr-2">
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
              clipRule="evenodd"
            />
          </svg>
        </span>
        Basic Information
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
          <input
            type="text"
            name="C_Name"
            value={formData.C_Name}
            onChange={onChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
            placeholder="Enter your full name"
          />
          {errors.C_Name && <p className="text-red-500 text-sm mt-1">{errors.C_Name}</p>}
        </div>

        {/* Tag Line */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Professional Tag Line *
          </label>
          <input
            type="text"
            name="C_TagLine"
            value={formData.C_TagLine}
            onChange={onChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
            placeholder="e.g., Full Stack Developer | React Specialist"
          />
          {errors.C_TagLine && <p className="text-red-500 text-sm mt-1">{errors.C_TagLine}</p>}
        </div>

        {/* First Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
          <input
            type="text"
            name="C_FName"
            value={formData.C_FName}
            onChange={onChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
            placeholder="First name"
          />
          {errors.C_FName && <p className="text-red-500 text-sm mt-1">{errors.C_FName}</p>}
        </div>

        {/* Last Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
          <input
            type="text"
            name="C_LName"
            value={formData.C_LName}
            onChange={onChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
            placeholder="Last name"
          />
          {errors.C_LName && <p className="text-red-500 text-sm mt-1">{errors.C_LName}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            name="C_Email"
            value={formData.C_Email}
            onChange={onChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 bg-gray-100"
            placeholder="your.email@example.com"
            disabled
          />
          {errors.C_Email && <p className="text-red-500 text-sm mt-1">{errors.C_Email}</p>}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
          <input
            type="tel"
            name="C_PhoneNo"
            value={formData.C_PhoneNo}
            onChange={onChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
            placeholder="1234567890"
          />
          {errors.C_PhoneNo && <p className="text-red-500 text-sm mt-1">{errors.C_PhoneNo}</p>}
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
          <select
            name="C_Gender"
            value={formData.C_Gender}
            onChange={onChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </select>
          {errors.C_Gender && <p className="text-red-500 text-sm mt-1">{errors.C_Gender}</p>}
        </div>

        {/* Date of Birth */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth *</label>
          <input
            type="date"
            name="C_DOB"
            value={formData.C_DOB}
            onChange={onChange}
            max={getCurrentDate()}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
          />
          {errors.C_DOB && <p className="text-red-500 text-sm mt-1">{errors.C_DOB}</p>}
        </div>
      </div>

      {/* Address */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Current Address</label>
        <textarea
          name="C_Address"
          value={formData.C_Address}
          onChange={onChange}
          rows="3"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
          placeholder="Enter your current address"
        />
        {errors.C_Address && <p className="text-red-500 text-sm mt-1">{errors.C_Address}</p>}
      </div>

      {/* Professional Summary */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Professional Summary *
        </label>
        <textarea
          name="C_Description"
          value={formData.C_Description}
          onChange={onChange}
          rows="4"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
          placeholder="Tell us about yourself, your skills, expertise, and what makes you unique as a developer..."
        />
        {errors.C_Description && (
          <p className="text-red-500 text-sm mt-1">{errors.C_Description}</p>
        )}
      </div>
    </div>
  );
}
