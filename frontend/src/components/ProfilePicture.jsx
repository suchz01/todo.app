import React from 'react'

const ProfilePicture = () => {
  return (
    <div>
        <label className="block text-sm font-medium mb-2">
            Profile Picture
        </label>
        <div className="flex items-center space-x-4 mb-4">
            <img
            src="https://via.placeholder.com/150"
            alt="Profile"
            className="w-16 h-16 rounded-full border border-gray-700"
            />
            <input
            type="file"
            accept="image/*"
            className="bg-gray-800/50 border border-gray-700 rounded-lg p-2 cursor-pointer"
            />
        </div>
    </div>
  )
}

export default ProfilePicture