"use client";

import React from "react"; // <- Add this line
import {
  FaFacebook,
  FaInstagram,
  FaSnapchatGhost,
  FaTiktok,
  FaTelegramPlane,
  FaPhone,
} from "react-icons/fa";

interface ProfileCardProps {
  username: string;
  socialMedia: string[];
  phoneNumbers: string[];
}

export default function ProfileCard({
  username,
  socialMedia,
  phoneNumbers,
}: ProfileCardProps) {
  const socialIcons: Record<string, React.ReactNode> = {
    facebook: <FaFacebook className="text-blue-600" />,
    instagram: <FaInstagram className="text-pink-500" />,
    snapchat: <FaSnapchatGhost className="text-yellow-400" />,
    tiktok: <FaTiktok className="text-black" />,
    telegram: <FaTelegramPlane className="text-blue-400" />,
  };

  return (
    <div className="max-w-sm w-full bg-white shadow-lg rounded-xl p-6 flex flex-col items-center gap-4">
      <h2 className="text-2xl font-bold">{username}</h2>

      {socialMedia.length > 0 && (
        <div className="flex gap-4">
          {socialMedia.map((sm) => (
            <div
              key={sm}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition"
              title={sm}
            >
              {socialIcons[sm.toLowerCase()]}
            </div>
          ))}
        </div>
      )}

      {phoneNumbers.length > 0 && (
        <div className="flex flex-col gap-1">
          {phoneNumbers.map((num, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 text-gray-700 font-medium"
            >
              <FaPhone />
              <span>{num}</span>
            </div>
          ))}
        </div>
      )}

      <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition">
        Follow
      </button>
    </div>
  );
}
