import React, { useState, useEffect } from "react";
import { getUserProfile, updateUserProfile, changePassword } from "@/lib/api";
import { useUser } from "@/context/UserContext";
import ProfileInformation from "@/components/ProfileInformation";
import PasswordChange from "@/components/PasswordChange";

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
    confirmPassword: ""
  });

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

  useEffect(() => {
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
    <div className="pt-20 p-4 md:p-8 lg:p-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold text-center md:text-left mb-4 bg-clip-text text-transparent bg-gradient-to-r from-sky-300 to-sky-500 animate-gradient">
          Profile Settings
        </h1>
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
          <ProfileInformation
            profileData={profileData}
            handleProfileChange={handleProfileChange}
            validationErrors={validationErrors}
            loading={loading}
            handleProfileSubmit={handleProfileSubmit}
            fetchProfile={fetchProfile}
          />
        )}

        {activeTab === "password" && (
          <PasswordChange
            profileData={profileData}
            passwordData={passwordData}
            handlePasswordChange={handlePasswordChange}
            validationErrors={validationErrors}
            loading={loading}
            handlePasswordSubmit={handlePasswordSubmit}
          />
        )}
      </div>
    </div>
  );
};

export default Profile;
