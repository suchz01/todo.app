import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import ProfilePicture from "./ProfilePicture";


const ProfileInformation = ({
  profileData,
  handleProfileChange,
  validationErrors,
  loading,
  handleProfileSubmit,
}) => {
  return (
    <div className="p-6 rounded-lg shadow-lg border border-gray-700/50 bg-gradient-to-r from-sky-300/10 to-sky-500/10 hover:from-sky-300/20 hover:to-sky-500/20 transition-all duration-500 ease-in-out hover:scale-100 scale-95">
      <ProfilePicture />
      <form onSubmit={handleProfileSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={profileData.name || ""}
              onChange={handleProfileChange}
              className={`w-full p-3 rounded-lg bg-gray-800/50 border h-16 ${
                validationErrors.name
                  ? "border-red-500"
                  : "border-gray-700"
              } focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition`}
            />
            {validationErrors.name && (
              <p className="text-red-400 text-xs mt-1">
                {validationErrors.name}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={profileData.email || ""}
              disabled
              className="w-full p-3 rounded-lg bg-gray-800/50 border border-gray-700 opacity-70 cursor-not-allowed"
            />
            <p className="text-xs text-gray-400 mt-1 ml-1">
              Email cannot be changed
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Date of Birth
            </label>
            <input
              type="date"
              name="dob"
              value={profileData.dob || ""}
              onChange={handleProfileChange}
              className={`w-full p-3 rounded-lg bg-gray-800/50 border ${
                validationErrors.dob
                  ? "border-red-500"
                  : "border-gray-700"
              } focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition`}
            />
            {validationErrors.dob && (
              <p className="text-red-400 text-xs mt-1">
                {validationErrors.dob}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={profileData.phone || ""}
              onChange={handleProfileChange}
              pattern="[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,9}"
              className={`w-full p-3 rounded-lg bg-gray-800/50 border ${
                validationErrors.phone
                  ? "border-red-500"
                  : "border-gray-700"
              } focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition`}
            />
            {validationErrors.phone && (
              <p className="text-red-400 text-xs mt-1">
                {validationErrors.phone}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Gender
            </label>
            <Select
              name="gender"
              value={profileData.gender || ""}
              onValueChange={(value) => 
                handleProfileChange({ 
                  target: { name: "gender", value } 
                })
              }
            >
              <SelectTrigger 
                className={`w-full h-12 bg-gray-800/50 border ${
                  validationErrors.gender
                    ? "border-red-500"
                    : "border-gray-700"
                } focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition cursor-pointer`}
              >
                <SelectValue placeholder="Select Gender" />
              </SelectTrigger>
              <SelectContent className={`bg-gray-800 text-white`}>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
            {validationErrors.gender && (
              <p className="text-red-400 text-xs mt-1">
                {validationErrors.gender}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Bio</label>
          <textarea
            name="bio"
            value={profileData.bio || ""}
            onChange={handleProfileChange}
            rows="4"
            maxLength="500"
            className={`w-full p-3 rounded-lg bg-gray-800/50 border ${
              validationErrors.bio ? "border-red-500" : "border-gray-700"
            } focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition`}
          ></textarea>
          {validationErrors.bio && (
            <p className="text-red-400 text-xs mt-1">
              {validationErrors.bio}
            </p>
          )}
          <p className="text-xs text-gray-400 mt-1">
            {profileData.bio ? profileData.bio.length : 0}/500 characters
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="cursor-pointer px-6 py-3 rounded-lg bg-sky-500 hover:bg-sky-600 transition text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default ProfileInformation; 