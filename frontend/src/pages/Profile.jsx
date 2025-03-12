import React, { useState, useEffect } from "react";
import { getUserProfile, updateUserProfile, changePassword } from "@/lib/api";
import { useUser } from "@/context/UserContext";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Profile = () => {
  const { fetchUser, loading: authLoading } = useUser();
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [messageVisible, setMessageVisible] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [profileData, setProfileData] = useState({});

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (success || error) {
      setMessageVisible(true);
      const timer = setTimeout(() => {
        setMessageVisible(false);
        setTimeout(() => {
          setSuccess("");
          setError("");
        }, 200);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await getUserProfile();

        if (data.dob) {
          const date = new Date(data.dob);
          data.dob = date.toISOString().split("T")[0];
        }

        setProfileData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (validationErrors[name]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (validationErrors[name]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateProfileForm = () => {
    const errors = {};

    if (profileData.name && profileData.name.length < 2) {
      errors.name = "Name must be at least 2 characters";
    }

    if (
      profileData.phone &&
      !/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,9}$/.test(
        profileData.phone
      )
    ) {
      errors.phone = "Invalid phone number format";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validatePasswordForm = () => {
    const errors = {};

    if (!passwordData.currentPassword) {
      errors.currentPassword = "Current password is required";
    } else if (passwordData.currentPassword.length < 6) {
      errors.currentPassword = "Current password must be at least 6 characters";
    }

    if (!passwordData.newPassword) {
      errors.newPassword = "New password is required";
    } else if (passwordData.newPassword.length < 6) {
      errors.newPassword = "New password must be at least 6 characters";
    } else if (
      !/[A-Z]/.test(passwordData.newPassword) ||
      !/[a-z]/.test(passwordData.newPassword) ||
      !/[0-9]/.test(passwordData.newPassword)
    ) {
      errors.newPassword =
        "Password must contain at least one uppercase letter, one lowercase letter, and one number";
    }

    if (!passwordData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateProfileForm()) {
      return;
    }

    try {
      setLoading(true);
      const updatedProfile = await updateUserProfile(profileData);
      setSuccess("Profile updated successfully");
      setProfileData(updatedProfile);
      fetchUser();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validatePasswordForm()) {
      return;
    }

    try {
      setLoading(true);
      await changePassword(
        passwordData.currentPassword,
        passwordData.newPassword,
        passwordData.confirmPassword
      );
      setSuccess("Password changed successfully");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 p-4 md:p-8 lg:p-12 md:mt-24 mt-10 ">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold text-center md:text-left mb-4 bg-clip-text text-transparent  bg-gradient-to-r from-sky-300 to-sky-500 animate-gradient ">Profile Settings</h1>

        <div className="flex mb-8 border-b border-gray-700">
          <button
            className={`px-4 py-2 font-medium cursor-pointer ${
              activeTab === "profile"
                ? "text-sky-500 border-b-2 border-sky-500"
                : "text-gray-400 hover:text-gray-300"
            }`}
            onClick={() => setActiveTab("profile")}
          >
            Profile Information
          </button>
          <button
            className={`px-4 py-2 font-medium cursor-pointer ${
              activeTab === "password"
                ? "text-sky-500 border-b-2 border-sky-500"
                : "text-gray-400 hover:text-gray-300"
            }`}
            onClick={() => setActiveTab("password")}
          >
            Change Password
          </button>
        </div>

        {success && (
          <div
            className={`mb-4 p-3 bg-green-500/20 border border-green-500/50 text-green-200 rounded-lg transition-opacity duration-200 ${
              messageVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            {success}
          </div>
        )}

        {error && (
          <div
            className={`mb-4 p-3 bg-red-500/20 border border-red-500/50 text-red-200 rounded-lg transition-opacity duration-200 ${
              messageVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            {error}
          </div>
        )}

        {activeTab === "profile" && (
          <div className="p-6 rounded-lg shadow-lg border border-gray-700/50 bg-gradient-to-r from-sky-300/10 to-sky-500/10 hover:from-sky-300/20 hover:to-sky-500/20 transition-all duration-500 ease-in-out hover:scale-100 scale-95">
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
                    onValueChange={(value) =>
                      handleProfileChange({ target: { name: "gender", value } })
                    }
                    value={profileData.gender || ""}
                  >
                    <SelectTrigger
                      className={`w-full h-12 p-3 rounded-lg bg-gray-800/50 border ${
                        validationErrors.gender
                          ? "border-red-500"
                          : "border-gray-700"
                      } focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition cursor-pointer`}
                    >
                      <SelectValue placeholder="Select Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male" className="cursor-pointer">
                        Male
                      </SelectItem>
                      <SelectItem value="Female" className="cursor-pointer">
                        Female
                      </SelectItem>
                      <SelectItem value="Other" className="cursor-pointer">
                        Other
                      </SelectItem>
                      <SelectItem
                        value="Prefer not to say"
                        className="cursor-pointer"
                      >
                        Prefer not to say
                      </SelectItem>
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
        )}

        {activeTab === "password" && (
          <div className="p-6 rounded-lg shadow-lg border border-gray-700/50 bg-gradient-to-r from-sky-300/10 to-sky-500/10 hover:from-sky-300/20 hover:to-sky-500/20 transition-all duration-500 ease-in-out hover:scale-100 scale-95">
            {profileData.googleId && !profileData.password ? (
              <div className="text-center p-6">
                <p className="text-lg mb-2">You signed up with Google</p>
                <p className="text-gray-400">
                  Password change is not available for accounts created with
                  Google.
                </p>
              </div>
            ) : (
              <form onSubmit={handlePasswordSubmit} className="space-y-6">
                <div className="relative">
                  <label className="block text-sm font-medium mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className={`w-full p-3 rounded-lg bg-gray-800/50 border ${
                        validationErrors.currentPassword
                          ? "border-red-500"
                          : "border-gray-700"
                      } focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition`}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
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
                    <p className="text-red-400 text-xs mt-1">
                      {validationErrors.currentPassword}
                    </p>
                  )}
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className={`w-full p-3 rounded-lg bg-gray-800/50 border ${
                        validationErrors.newPassword
                          ? "border-red-500"
                          : "border-gray-700"
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
                    <p className="text-red-400 text-xs mt-1">
                      {validationErrors.newPassword}
                    </p>
                  )}
                </div>
                <div className="relative">
                  <label className="block text-sm font-medium mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className={`w-full p-3 rounded-lg bg-gray-800/50 border ${
                        validationErrors.confirmPassword
                          ? "border-red-500"
                          : "border-gray-700"
                      } focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition`}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
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
                    <p className="text-red-400 text-xs mt-1">
                      {validationErrors.confirmPassword}
                    </p>
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
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
