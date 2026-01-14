"use client";

import { supabase } from "../../../lib/supebase";
import { useEffect, useState } from "react";

interface ProfileProps {
  params: Promise<{ username: string }>;
}

interface ProfileData {
  id: number;
  username: string;
  social_media: Record<string, string[]>; // Changed to string[] array
  phone_numbers: string[];
  created_at: string;
}

// Platform icons with colors
const platformIcons: Record<string, { icon: string; color: string }> = {
  facebook: { icon: 'Facebook', color: 'bg-blue-600 hover:bg-blue-700' },
  instagram: { icon: 'Instagram', color: 'bg-pink-600 hover:bg-pink-700' },
  twitter: { icon: 'Twitter', color: 'bg-blue-400 hover:bg-blue-500' },
  x: { icon: 'X', color: 'bg-black hover:bg-gray-800' },
  linkedin: { icon: 'LinkedIn', color: 'bg-blue-700 hover:bg-blue-800' },
  snapchat: { icon: 'Snapchat', color: 'bg-yellow-400 hover:bg-yellow-500' },
  tiktok: { icon: 'TikTok', color: 'bg-black hover:bg-gray-800' },
  telegram: { icon: 'Telegram', color: 'bg-blue-500 hover:bg-blue-600' },
  whatsapp: { icon: 'WhatsApp', color: 'bg-green-500 hover:bg-green-600' },
  youtube: { icon: 'YouTube', color: 'bg-red-600 hover:bg-red-700' },
  github: { icon: 'GitHub', color: 'bg-gray-800 hover:bg-black' },
  discord: { icon: 'Discord', color: 'bg-indigo-600 hover:bg-indigo-700' },
  reddit: { icon: 'Reddit', color: 'bg-orange-600 hover:bg-orange-700' },
  custom: { icon: 'Link', color: 'bg-purple-600 hover:bg-purple-700' },
  default: { icon: 'Link', color: 'bg-gray-600 hover:bg-gray-700' }
};

export default function ProfilePage({ params }: ProfileProps) {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const { username } = await params;
        
        const { data, error: supabaseError } = await supabase
          .from("Profile")
          .select("*")
          .eq("username", username)
          .single();

        if (supabaseError || !data) {
          setError(`Profile "${username}" not found`);
        } else {
          setProfile(data);
        }
      } catch (err) {
        setError("Failed to load profile");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [params]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm text-center">
          <div className="text-5xl mb-4">😕</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Profile Not Found</h2>
          <p className="text-gray-500 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  const social_media = profile.social_media || {};
  const phone_numbers = profile.phone_numbers || [];

  const getPlatformInfo = (platform: string) => {
    const normalizedPlatform = platform.toLowerCase();
    return platformIcons[normalizedPlatform] || platformIcons.default;
  };

  // Function to clean URL for display
  const cleanUrlForDisplay = (url: string) => {
    if (typeof url !== 'string') return '';
    return url.replace(/^https?:\/\/(www\.)?/, '');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      {/* Main Profile Card */}
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white text-center">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white">
            <span className="text-3xl font-bold text-blue-600">
              {profile.username.charAt(0).toUpperCase()}
            </span>
          </div>
          <h1 className="text-2xl font-bold">{profile.username}</h1>
          {profile.created_at && (
            <p className="text-blue-100 text-sm mt-1">
              Joined {new Date(profile.created_at).toLocaleDateString()}
            </p>
          )}
        </div>

        {/* Social Media Section */}
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">🌐</span> Social Media Links
          </h2>

          {Object.keys(social_media).length === 0 ? (
            <div className="text-center py-6 bg-gray-50 rounded-lg">
              <div className="text-3xl mb-2">🔗</div>
              <p className="text-gray-500">No social media links</p>
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(social_media).map(([platform, urls]) => {
                // urls is now an array
                const urlArray = Array.isArray(urls) ? urls : [urls];
                const platformInfo = getPlatformInfo(platform);
                
                return (
                  <div key={platform} className="space-y-2">
                    <div className="flex items-center mb-1">
                      <div className={`w-8 h-8 ${platformInfo.color} rounded-lg flex items-center justify-center mr-2`}>
                        <span className="text-white text-sm font-bold">{platformInfo.icon.charAt(0)}</span>
                      </div>
                      <span className="font-medium capitalize text-gray-700">{platform}</span>
                      <span className="ml-2 text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                        {urlArray.length} {urlArray.length === 1 ? 'account' : 'accounts'}
                      </span>
                    </div>
                    
                    {/* Display each URL in the array */}
                    {urlArray.map((url, index) => (
                      <a
                        key={index}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 group"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-white border border-gray-300 rounded flex items-center justify-center mr-3 text-gray-600">
                              <span className="text-sm font-bold">{index + 1}</span>
                            </div>
                            <div className="text-left">
                              <div className="text-sm text-gray-600 truncate max-w-[200px]">
                                {cleanUrlForDisplay(url)}
                              </div>
                            </div>
                          </div>
                          <div className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Phone Numbers Section */}
        <div className="p-6 pt-0">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">📞</span> Phone Numbers
          </h2>

          {phone_numbers.length === 0 ? (
            <div className="text-center py-6 bg-gray-50 rounded-lg">
              <div className="text-3xl mb-2">📱</div>
              <p className="text-gray-500">No phone numbers</p>
            </div>
          ) : (
            <div className="space-y-3">
              {phone_numbers.map((num: string, i: number) => (
                <div 
                  key={i} 
                  className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3 text-green-600">
                    <span className="text-xl">📞</span>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-700">
                      Phone {phone_numbers.length > 1 ? `#${i + 1}` : ''}
                    </div>
                    <a 
                      href={`tel:${num.replace(/\D/g, '')}`}
                      className="text-green-600 hover:text-green-700 text-sm"
                    >
                      {num}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Stats */}
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="flex justify-around text-center">
            <div>
              <div className="text-lg font-bold text-blue-600">
                {Object.values(social_media).flat().length}
              </div>
              <div className="text-xs text-gray-500">Total Links</div>
            </div>
            <div>
              <div className="text-lg font-bold text-green-600">{phone_numbers.length}</div>
              <div className="text-xs text-gray-500">Phone Numbers</div>
            </div>
            <div>
              <div className="text-lg font-bold text-purple-600">
                {Object.keys(social_media).length}
              </div>
              <div className="text-xs text-gray-500">Platforms</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}