import React, { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

export function ProfilePage() {
  const user = useQuery(api.users.getCurrentUser);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    displayName: "",
    bio: "",
    socialLinks: {
      instagram: "",
      twitter: "",
      youtube: "",
      spotify: "",
    },
  });

  const updateProfile = useMutation(api.users.updateProfile);
  const userSongs = useQuery(api.songs.getSongsBySinger, 
    user?.profile?.role === "singer" && user?._id ? { singerId: user._id } : "skip"
  );

  // Initialize form data when user data loads
  React.useEffect(() => {
    if (user?.profile) {
      setFormData({
        displayName: user.profile.displayName || "",
        bio: user.profile.bio || "",
        socialLinks: {
          instagram: user.profile.socialLinks?.instagram || "",
          twitter: user.profile.socialLinks?.twitter || "",
          youtube: user.profile.socialLinks?.youtube || "",
          spotify: user.profile.socialLinks?.spotify || "",
        },
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await updateProfile({
        displayName: formData.displayName || undefined,
        bio: formData.bio || undefined,
        socialLinks: Object.values(formData.socialLinks).some(link => link) 
          ? formData.socialLinks 
          : undefined,
      });
      
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 p-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                {(user.profile?.displayName || user.name || "U").charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  {user.profile?.displayName || user.name || "User"}
                </h1>
                <div className="flex items-center space-x-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    user.profile?.role === "singer" 
                      ? "bg-purple-500/20 text-purple-400" 
                      : user.profile?.role === "admin"
                      ? "bg-red-500/20 text-red-400"
                      : "bg-blue-500/20 text-blue-400"
                  }`}>
                    {user.profile?.role || "spectator"}
                  </span>
                  {user.email && (
                    <span className="text-gray-400">{user.email}</span>
                  )}
                </div>
              </div>
            </div>
            
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
            >
              {isEditing ? "Cancel" : "Edit Profile"}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Display Name
                </label>
                <input
                  type="text"
                  value={formData.displayName}
                  onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none"
                  placeholder="Your display name"
                />
              </div>

              {user.profile?.role === "singer" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Bio
                    </label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                      rows={4}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none"
                      placeholder="Tell us about your music style and journey..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      Social Links
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(formData.socialLinks).map(([platform, value]) => (
                        <input
                          key={platform}
                          type="url"
                          value={value}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            socialLinks: { ...prev.socialLinks, [platform]: e.target.value }
                          }))}
                          className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none"
                          placeholder={`${platform.charAt(0).toUpperCase() + platform.slice(1)} URL`}
                        />
                      ))}
                    </div>
                  </div>
                </>
              )}

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold rounded-lg hover:from-cyan-600 hover:to-purple-600 transition-all"
                >
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              {/* Bio Section */}
              {user.profile?.bio && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">About</h3>
                  <p className="text-gray-300 leading-relaxed">{user.profile.bio}</p>
                </div>
              )}

              {/* Social Links */}
              {user.profile?.socialLinks && Object.values(user.profile.socialLinks).some(link => link) && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Social Links</h3>
                  <div className="flex flex-wrap gap-3">
                    {Object.entries(user.profile.socialLinks).map(([platform, url]) => 
                      url ? (
                        <a
                          key={platform}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-gray-700 text-cyan-400 rounded-lg hover:bg-gray-600 transition-colors capitalize"
                        >
                          {platform}
                        </a>
                      ) : null
                    )}
                  </div>
                </div>
              )}

              {/* Ratings for singers */}
              {user.profile?.role === "singer" && user.profile?.ratings && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Average Ratings</h3>
                  <div className="grid grid-cols-5 gap-4">
                    {Object.entries(user.profile.ratings).map(([key, value]) => (
                      <div key={key} className="text-center">
                        <div className="text-2xl font-bold text-cyan-400">{(value as number).toFixed(1)}</div>
                        <div className="text-sm text-gray-400 capitalize">{key}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* User's songs (for singers) */}
              {user.profile?.role === "singer" && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">My Tracks</h3>
                  {userSongs && userSongs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {userSongs.map((song) => (
                        <div key={song._id} className="bg-gray-700/50 rounded-lg p-4">
                          <h4 className="font-semibold text-white mb-2">{song.title}</h4>
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-4">
                              <span className="text-green-400">👍 {song.upvotes}</span>
                              <span className="text-red-400">👎 {song.downvotes}</span>
                            </div>
                            {song.ratings && (
                              <span className="text-yellow-400">
                                ⭐ {(Object.values(song.ratings).reduce((sum, val) => sum + val, 0) / 5).toFixed(1)}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400">No tracks posted yet.</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
