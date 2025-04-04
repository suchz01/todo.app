import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from "sonner";
import { useUser } from '../context/UserContext';

const ProfilePicture = ({ profileData, fetchProfile }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [profilePic, setProfilePic] = useState('');
  const { fetchUser } = useUser();
  useEffect(() => {
    setProfilePic(
      profileData?.profilePicture
        ? `${profileData.profilePicture}?t=${Date.now()}`
        : "https://static.vecteezy.com/system/resources/previews/020/911/740/non_2x/user-profile-icon-profile-avatar-user-icon-male-icon-face-icon-profile-icon-free-png.png"
    );
  }, [profileData]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file || file.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 5MB");
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append('profilePicture', file);

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND}/users/profile-picture`,
        formData,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          timeout: 30000,
        }
      );

      if (data.success) {
        setProfilePic(`${data.profilePicture}?t=${Date.now()}`);
        fetchUser();
        fetchProfile?.();
        toast.success("Profile picture updated successfully!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to upload profile picture");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-2">Profile Picture</label>
      <div className="flex items-center space-x-4 mb-4">
        <div className="relative w-16 h-16">
          <img
            src={profilePic}
            alt="Profile"
            className="w-16 h-16 rounded-full border border-gray-700 object-cover"
            loading="lazy"
          />
          {isLoading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
              <div className="animate-spin h-8 w-8 border-t-2 border-b-2 border-sky-500 rounded-full"></div>
            </div>
          )}
        </div>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={isLoading}
          className="bg-gray-800/50 border border-gray-700 rounded-lg p-2 cursor-pointer"
        />
      </div>
    </div>
  );
};

export default ProfilePicture;
