"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ProfileForm from "../components/ProfileForm";
import { supabase } from "../lib/supebase";

export default function Home() {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchUsername, setSearchUsername] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const handleShowProfile = async () => {
    if (!searchUsername.trim()) {
      setSearchError("Please enter a username");
      return;
    }

    setSearchLoading(true);
    setSearchError(null);

    try {
      // Check if profile exists
      const { data, error } = await supabase
        .from("Profile")
        .select("username")
        .eq("username", searchUsername.trim())
        .single();

      if (error || !data) {
        setSearchError(`Profile "${searchUsername}" not found`);
      } else {
        // Profile exists, navigate to it
        router.push(`/profilecard/${searchUsername}`);
        setShowSearch(false);
        setSearchUsername("");
      }
    } catch (err) {
      setSearchError("Error checking profile");
      console.error(err);
    } finally {
      setSearchLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white px-4 py-12">
      
      {/* Hero Section */}
      <div className="text-center max-w-3xl mb-12">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Profile Card
        </h1>
        <p className="text-xl text-gray-300 mb-10">
          Create beautiful profile cards with all your social links in one place.
          Share your digital identity effortlessly.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-6 mb-16">
        {/* Show Profile Button */}
        <button
          onClick={() => setShowSearch(true)}
          className="
            relative
            px-8 py-4 
            bg-gradient-to-r from-blue-600 to-cyan-500 
            text-white 
            font-semibold 
            rounded-2xl 
            shadow-xl 
            hover:shadow-blue-500/30
            hover:scale-105
            active:scale-95
            transition-all
            duration-300
            flex items-center justify-center gap-3
            group
            overflow-hidden
          "
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          <span className="text-2xl">👁️</span>
          <span className="text-lg">Show Profile</span>
        </button>

        {/* Add Profile Button */}
        <button
          onClick={() => setShowForm(true)}
          className="
            relative
            px-8 py-4 
            bg-gradient-to-r from-purple-600 to-pink-500 
            text-white 
            font-semibold 
            rounded-2xl 
            shadow-xl 
            hover:shadow-purple-500/30
            hover:scale-105
            active:scale-95
            transition-all
            duration-300
            flex items-center justify-center gap-3
            group
            overflow-hidden
          "
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          <span className="text-2xl">✨</span>
          <span className="text-lg">Create New Profile</span>
        </button>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mb-12">
        <div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700 hover:border-purple-500 transition-colors">
          <div className="text-4xl mb-4">🔗</div>
          <h3 className="text-xl font-bold mb-2">All Links in One</h3>
          <p className="text-gray-400">Combine all your social media profiles into a single, shareable card.</p>
        </div>
        
        <div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700 hover:border-blue-500 transition-colors">
          <div className="text-4xl mb-4">📱</div>
          <h3 className="text-xl font-bold mb-2">Mobile Friendly</h3>
          <p className="text-gray-400">Looks great on any device - desktop, tablet, or mobile.</p>
        </div>
        
        <div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700 hover:border-green-500 transition-colors">
          <div className="text-4xl mb-4">⚡</div>
          <h3 className="text-xl font-bold mb-2">Instant Sharing</h3>
          <p className="text-gray-400">Share your profile card with just one link.</p>
        </div>
      </div>

      {/* Search Profile Modal */}
      {showSearch && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-lg flex items-center justify-center z-50 p-4">
          <div className="
            bg-gradient-to-br from-gray-900 to-gray-800
            text-white 
            p-8 
            rounded-3xl 
            shadow-2xl 
            w-full max-w-md
            border border-gray-700
            animate-scaleIn
          ">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                  Find Profile
                </h2>
                <p className="text-gray-400 text-sm mt-1">Enter a username to view their profile</p>
              </div>
              <button
                onClick={() => {
                  setShowSearch(false);
                  setSearchUsername("");
                  setSearchError(null);
                }}
                className="text-gray-400 hover:text-white text-2xl p-2 hover:bg-gray-800 rounded-full transition"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={searchUsername}
                  onChange={(e) => {
                    setSearchUsername(e.target.value);
                    setSearchError(null);
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && handleShowProfile()}
                  placeholder="Enter username (e.g., alex_smith)"
                  className="
                    w-full 
                    p-4 
                    rounded-xl 
                    bg-gray-900 
                    border 
                    border-gray-700 
                    focus:border-blue-500 
                    focus:ring-2 
                    focus:ring-blue-500/30 
                    outline-none 
                    transition
                    text-lg
                    placeholder-gray-500
                  "
                  autoFocus
                />
              </div>

              {searchError && (
                <div className="p-3 bg-red-900/30 border border-red-700 rounded-lg">
                  <div className="flex items-center gap-2 text-red-300">
                    <span className="text-xl">⚠️</span>
                    <span>{searchError}</span>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowSearch(false);
                    setSearchUsername("");
                    setSearchError(null);
                  }}
                  className="flex-1 px-6 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 transition font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleShowProfile}
                  disabled={searchLoading || !searchUsername.trim()}
                  className="
                    flex-1 
                    px-6 
                    py-3 
                    rounded-xl 
                    bg-gradient-to-r 
                    from-blue-600 
                    to-cyan-500 
                    hover:from-blue-700 
                    hover:to-cyan-600 
                    transition 
                    font-medium
                    flex 
                    items-center 
                    justify-center 
                    gap-2
                    disabled:opacity-50
                    disabled:cursor-not-allowed
                  "
                >
                  {searchLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Checking...
                    </>
                  ) : (
                    <>
                      <span>Show Profile</span>
                      <span className="text-xl">🔍</span>
                    </>
                  )}
                </button>
              </div>

              {/* Quick Tip */}
              <div className="pt-4 border-t border-gray-800">
                <p className="text-sm text-gray-400 text-center">
                  Don't have a profile?{' '}
                  <button
                    onClick={() => {
                      setShowSearch(false);
                      setShowForm(true);
                    }}
                    className="text-blue-400 hover:text-blue-300 underline transition"
                  >
                    Create one now
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Profile Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-lg flex items-center justify-center z-50 p-4">
          <div className="
            bg-gradient-to-br from-gray-900 to-gray-800
            text-white 
            rounded-3xl 
            shadow-2xl 
            w-full max-w-2xl
            border border-gray-700
            animate-scaleIn
            max-h-[90vh]
            overflow-y-auto
          ">
            <ProfileForm onClose={() => setShowForm(false)} />
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-12 text-center text-gray-500 text-sm">
        <p>~ Alex .D Mekhail ~ © 2026</p>
      </div>
    </div>
  );
}