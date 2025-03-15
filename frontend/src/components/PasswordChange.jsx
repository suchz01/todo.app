import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const PasswordChange = ({
  profileData,
  passwordData,
  handlePasswordChange,
  validationErrors,
  loading,
  handlePasswordSubmit,
}) => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  if (profileData.googleId && !profileData.password) {
    return (
      <div className="p-6 rounded-lg shadow-lg border border-gray-700/50 bg-gradient-to-r from-sky-300/10 to-sky-500/10 hover:from-sky-300/20 hover:to-sky-500/20 transition-all duration-500 ease-in-out hover:scale-100 scale-95">
        <div className="text-center p-6">
          <p className="text-lg mb-2">You signed up with Google</p>
          <p className="text-gray-400">
            Password change is not available for accounts created with Google.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-lg shadow-lg border border-gray-700/50 bg-gradient-to-r from-sky-300/10 to-sky-500/10 hover:from-sky-300/20 hover:to-sky-500/20 transition-all duration-500 ease-in-out hover:scale-100 scale-95">
      <form onSubmit={handlePasswordSubmit} className="space-y-6">
        <div className="relative">
          <label className="block text-sm font-medium mb-2">Current Password</label>
          <div className="relative">
            <input
              type={showCurrentPassword ? "text" : "password"}
              name="currentPassword"
              value={passwordData.currentPassword || ""}
              onChange={handlePasswordChange}
              className={`w-full p-3 rounded-lg bg-gray-800/50 border ${
                validationErrors.currentPassword ? "border-red-500" : "border-gray-700"
              } focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition`}
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute right-3 top-2/7 text-gray-400 hover:text-gray-300"
            >
              {showCurrentPassword ? (
                <AiOutlineEyeInvisible size={20} />
              ) : (
                <AiOutlineEye size={20} />
              )}
            </button>
          </div>
          {validationErrors.currentPassword && (
            <p className="text-red-400 text-xs mt-1">{validationErrors.currentPassword}</p>
          )}
        </div>

        <div className="relative">
          <label className="block text-sm font-medium mb-2">New Password</label>
          <div className="relative">
            <input
              type={showNewPassword ? "text" : "password"}
              name="newPassword"
              value={passwordData.newPassword || ""}
              onChange={handlePasswordChange}
              className={`w-full p-3 rounded-lg bg-gray-800/50 border ${
                validationErrors.newPassword ? "border-red-500" : "border-gray-700"
              } focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition`}
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-2/7 text-gray-400 hover:text-gray-300"
            >
              {showNewPassword ? (
                <AiOutlineEyeInvisible size={20} />
              ) : (
                <AiOutlineEye size={20} />
              )}
            </button>
          </div>
          {validationErrors.newPassword && (
            <p className="text-red-400 text-xs mt-1">{validationErrors.newPassword}</p>
          )}
        </div>

        <div className="relative">
          <label className="block text-sm font-medium mb-2">Confirm New Password</label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={passwordData.confirmPassword || ""}
              onChange={handlePasswordChange}
              className={`w-full p-3 rounded-lg bg-gray-800/50 border ${
                validationErrors.confirmPassword ? "border-red-500" : "border-gray-700"
              } focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-2/7 text-gray-400 hover:text-gray-300"
            >
              {showConfirmPassword ? (
                <AiOutlineEyeInvisible size={20} />
              ) : (
                <AiOutlineEye size={20} />
              )}
            </button>
          </div>
          {validationErrors.confirmPassword && (
            <p className="text-red-400 text-xs mt-1">{validationErrors.confirmPassword}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="cursor-pointer px-6 py-3 rounded-lg bg-sky-500 hover:bg-sky-600 transition text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Changing Password..." : "Change Password"}
        </button>
      </form>
    </div>
  );
};

export default PasswordChange; 