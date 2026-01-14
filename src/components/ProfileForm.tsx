"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supebase";

interface Props {
  onClose: () => void;
}

// Platform configurations with URL patterns
const platforms = [
  { 
    id: "facebook", 
    label: "Facebook", 
    icon: "📘",
    color: "bg-blue-600",
    urlPattern: "https://facebook.com/{username}",
    placeholder: "Username (e.g., john.doe)"
  },
  { 
    id: "instagram", 
    label: "Instagram", 
    icon: "📷",
    color: "bg-pink-600",
    urlPattern: "https://instagram.com/{username}",
    placeholder: "Username (e.g., johndoe)"
  },
  { 
    id: "snapchat", 
    label: "Snapchat", 
    icon: "👻",
    color: "bg-yellow-500",
    urlPattern: "https://snapchat.com/add/{username}",
    placeholder: "Username (e.g., john_doe)"
  },
  { 
    id: "tiktok", 
    label: "TikTok", 
    icon: "🎵",
    color: "bg-black",
    urlPattern: "https://tiktok.com/@{username}",
    placeholder: "Username (e.g., johndoe)"
  },
  { 
    id: "telegram", 
    label: "Telegram", 
    icon: "📱",
    color: "bg-blue-500",
    urlPattern: "https://t.me/{username}",
    placeholder: "Username (e.g., johndoe)"
  },
  { 
    id: "twitter", 
    label: "Twitter", 
    icon: "🐦",
    color: "bg-blue-400",
    urlPattern: "https://twitter.com/{username}",
    placeholder: "Username (e.g., johndoe)"
  },
  { 
    id: "linkedin", 
    label: "LinkedIn", 
    icon: "💼",
    color: "bg-blue-700",
    urlPattern: "https://linkedin.com/in/{username}",
    placeholder: "Username (e.g., johndoe)"
  },
  { 
    id: "whatsapp", 
    label: "WhatsApp", 
    icon: "💚",
    color: "bg-green-500",
    urlPattern: "https://wa.me/{number}",
    placeholder: "Phone number with country code (e.g., 1234567890)"
  },
  { 
    id: "youtube", 
    label: "YouTube", 
    icon: "📺",
    color: "bg-red-600",
    urlPattern: "https://youtube.com/@{username}",
    placeholder: "Username (e.g., johndoe)"
  },
  { 
    id: "discord", 
    label: "Discord", 
    icon: "🎮",
    color: "bg-indigo-600",
    urlPattern: "https://discord.com/users/{username}",
    placeholder: "Username#0000"
  },
  { 
    id: "github", 
    label: "GitHub", 
    icon: "🐙",
    color: "bg-gray-800",
    urlPattern: "https://github.com/{username}",
    placeholder: "Username (e.g., johndoe)"
  },
  { 
    id: "reddit", 
    label: "Reddit", 
    icon: "👤",
    color: "bg-orange-600",
    urlPattern: "https://reddit.com/u/{username}",
    placeholder: "Username (e.g., johndoe)"
  },
  { 
    id: "custom", 
    label: "Custom Link", 
    icon: "🔗",
    color: "bg-purple-600",
    urlPattern: "{custom}",
    placeholder: "Full URL (e.g., https://example.com)"
  },
];

export default function ProfileForm({ onClose }: Props) {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  // Store multiple accounts per platform: { platformId: ["username1", "username2"] }
  const [platformAccounts, setPlatformAccounts] = useState<Record<string, string[]>>({});
  // Store multiple phone numbers
  const [phoneNumbers, setPhoneNumbers] = useState<string[]>([""]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Toggle platform selection
  const togglePlatform = (id: string) => {
    setSelectedPlatforms((prev) => {
      if (prev.includes(id)) {
        // Remove platform and its accounts
        const newAccounts = { ...platformAccounts };
        delete newAccounts[id];
        setPlatformAccounts(newAccounts);
        return prev.filter((p) => p !== id);
      } else {
        // Add platform with one empty account
        setPlatformAccounts(prev => ({
          ...prev,
          [id]: [""]
        }));
        return [...prev, id];
      }
    });
  };

  // Add another account for a specific platform
  const addAccountToPlatform = (platformId: string) => {
    setPlatformAccounts(prev => ({
      ...prev,
      [platformId]: [...(prev[platformId] || []), ""]
    }));
  };

  // Update a specific account for a platform
  const updatePlatformAccount = (platformId: string, accountIndex: number, value: string) => {
    setPlatformAccounts(prev => ({
      ...prev,
      [platformId]: prev[platformId].map((acc, idx) => 
        idx === accountIndex ? value : acc
      )
    }));
  };

  // Remove a specific account from a platform
  const removePlatformAccount = (platformId: string, accountIndex: number) => {
    setPlatformAccounts(prev => ({
      ...prev,
      [platformId]: prev[platformId].filter((_, idx) => idx !== accountIndex)
    }));
  };

  // Add new phone number field
  const addPhoneNumber = () => {
    setPhoneNumbers(prev => [...prev, ""]);
  };

  // Update phone number
  const updatePhoneNumber = (index: number, value: string) => {
    setPhoneNumbers(prev => prev.map((num, idx) => idx === index ? value : num));
  };

  // Remove phone number
  const removePhoneNumber = (index: number) => {
    if (phoneNumbers.length > 1) {
      setPhoneNumbers(prev => prev.filter((_, idx) => idx !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Build social media object with full URLs
      const socialMedia: Record<string, string[]> = {};
      
      selectedPlatforms.forEach(platformId => {
        const platform = platforms.find(p => p.id === platformId);
        if (platform && platformAccounts[platformId]) {
          // Convert each username to full URL
          const urls = platformAccounts[platformId]
            .filter(acc => acc.trim() !== "")
            .map(acc => {
              if (platformId === "custom") {
                return acc.startsWith("http") ? acc : `https://${acc}`;
              }
              return platform.urlPattern.replace("{username}", acc).replace("{number}", acc);
            });
          
          if (urls.length > 0) {
            socialMedia[platformId] = urls;
          }
        }
      });

      // Filter out empty phone numbers
      const validPhoneNumbers = phoneNumbers.filter(num => num.trim() !== "");

      const { error } = await supabase.from("Profile").insert({
        username,
        social_media: socialMedia,
        phone_numbers: validPhoneNumbers,
      });

      if (error) {
        alert("Error: " + error.message);
      } else {
        onClose();
        router.push(`/profilecard/${username}`);
        router.refresh();
      }
    } catch (error: any) {
      alert("Error: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-lg flex items-center justify-center p-4 z-50">
      <form 
        onSubmit={handleSubmit}
        className="bg-gradient-to-br from-gray-900 to-gray-800 text-white w-full max-w-2xl rounded-3xl shadow-2xl p-6 border border-gray-700"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Create Profile Card
            </h2>
            <p className="text-gray-400 text-sm mt-1">Add your social media profiles and contact info</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl p-2 hover:bg-gray-800 rounded-full transition"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
          {/* Username Section */}
          <div className="bg-gray-800/50 rounded-2xl p-5 border border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                <span className="text-xl">👤</span>
              </div>
              <div>
                <label className="font-semibold text-lg">Profile Username</label>
                <p className="text-gray-400 text-sm">Your unique profile identifier</p>
              </div>
            </div>
            <input
              type="text"
              placeholder="e.g., alex_smith"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-4 rounded-xl bg-gray-900 border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 outline-none transition text-lg"
              required
            />
          </div>

          {/* Social Media Platforms */}
          <div className="bg-gray-800/50 rounded-2xl p-5 border border-gray-700">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center">
                <span className="text-xl">🌐</span>
              </div>
              <div>
                <label className="font-semibold text-lg">Social Media</label>
                <p className="text-gray-400 text-sm">Select platforms and add your usernames</p>
              </div>
            </div>

            {/* Platform Selection Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-6">
              {platforms.map((platform) => (
                <button
                  type="button"
                  key={platform.id}
                  onClick={() => togglePlatform(platform.id)}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 flex flex-col items-center gap-2 ${
                    selectedPlatforms.includes(platform.id)
                      ? `${platform.color} border-transparent text-white scale-105 shadow-lg`
                      : 'bg-gray-900 border-gray-700 text-gray-400 hover:border-gray-600 hover:text-white'
                  }`}
                >
                  <span className="text-2xl">{platform.icon}</span>
                  <span className="text-sm font-medium">{platform.label}</span>
                </button>
              ))}
            </div>

            {/* Account Inputs for Selected Platforms */}
            {selectedPlatforms.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-300 mb-4">Account Details</h3>
                {selectedPlatforms.map((platformId) => {
                  const platform = platforms.find(p => p.id === platformId)!;
                  const accounts = platformAccounts[platformId] || [""];
                  
                  return (
                    <div key={platformId} className="bg-gray-900/50 rounded-xl p-4 border border-gray-700">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-8 h-8 ${platform.color} rounded-lg flex items-center justify-center`}>
                          <span>{platform.icon}</span>
                        </div>
                        <span className="font-semibold">{platform.label}</span>
                      </div>
                      
                      <div className="space-y-3">
                        {accounts.map((account, accIndex) => (
                          <div key={accIndex} className="flex gap-2 items-center">
                            <div className="flex-1">
                              <input
                                type="text"
                                placeholder={platform.placeholder}
                                value={account}
                                onChange={(e) => updatePlatformAccount(platformId, accIndex, e.target.value)}
                                className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                                required={accounts.length === 1}
                              />
                            </div>
                            {accounts.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removePlatformAccount(platformId, accIndex)}
                                className="p-3 text-red-400 hover:text-red-300 hover:bg-red-900/30 rounded-lg transition"
                              >
                                ✕
                              </button>
                            )}
                          </div>
                        ))}
                        
                        <button
                          type="button"
                          onClick={() => addAccountToPlatform(platformId)}
                          className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1 transition"
                        >
                          <span>+ Add another {platform.label} account</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Phone Numbers */}
          <div className="bg-gray-800/50 rounded-2xl p-5 border border-gray-700">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                <span className="text-xl">📞</span>
              </div>
              <div>
                <label className="font-semibold text-lg">Phone Numbers</label>
                <p className="text-gray-400 text-sm">Add one or multiple phone numbers</p>
              </div>
            </div>

            <div className="space-y-3">
              {phoneNumbers.map((num, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <div className="flex-1">
                    <input
                      type="tel"
                      placeholder={`Phone number ${index + 1} (e.g., +1234567890)`}
                      value={num}
                      onChange={(e) => updatePhoneNumber(index, e.target.value)}
                      className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition"
                      
                    />
                  </div>
                  {phoneNumbers.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removePhoneNumber(index)}
                      className="p-3 text-red-400 hover:text-red-300 hover:bg-red-900/30 rounded-lg transition"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
              
              <button
                type="button"
                onClick={addPhoneNumber}
                className="text-sm text-green-400 hover:text-green-300 flex items-center gap-1 transition"
              >
                <span>+ Add another phone number</span>
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-700">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 transition font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Creating...
              </>
            ) : (
              <>
                <span>Create Profile</span>
                <span className="text-xl">🚀</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}