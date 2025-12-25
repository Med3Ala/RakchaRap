import React, { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { useParams } from "react-router-dom";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { toast } from "sonner";
import { RadarChart } from "./RadarChart";

export function ProfilePage() {
  const { userId } = useParams<{ userId: string }>();
  const currentUser = useQuery(api.users.getCurrentUser);

  // If userId is in URL, fetch that profile. Otherwise fetch current user.
  const displayUser = useQuery(
    userId ? api.users.getSingerProfile : api.users.getCurrentUser,
    (userId ? { userId: userId as Id<"users"> } : {}) as any
  );

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
    displayUser?.profile?.role === "singer" && displayUser?._id ? { singerId: displayUser._id } : "skip"
  );

  const isOwnProfile = !userId || (currentUser && currentUser._id === userId);

  // Initialize form data when user data loads
  React.useEffect(() => {
    if (displayUser?.profile && isOwnProfile) {
      setFormData({
        displayName: displayUser.profile.displayName || "",
        bio: displayUser.profile.bio || "",
        socialLinks: {
          instagram: displayUser.profile.socialLinks?.instagram || "",
          twitter: displayUser.profile.socialLinks?.twitter || "",
          youtube: displayUser.profile.socialLinks?.youtube || "",
          spotify: displayUser.profile.socialLinks?.spotify || "",
        },
      });
    }
  }, [displayUser, isOwnProfile]);

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

  if (displayUser === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  if (displayUser === null) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <div className="text-6xl mb-4">👤</div>
        <h2 className="text-2xl font-bold text-white mb-2">Artist not found</h2>
        <p className="text-gray-400">The profile you are looking for does not exist or has been removed.</p>
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
                {(displayUser.profile?.displayName || displayUser.name || "U").charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  {displayUser.profile?.displayName || displayUser.name || "User"}
                </h1>
                <div className="flex items-center space-x-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${displayUser.profile?.role === "singer"
                    ? "bg-purple-500/20 text-purple-400"
                    : displayUser.profile?.role === "admin"
                      ? "bg-red-500/20 text-red-400"
                      : "bg-blue-500/20 text-blue-400"
                    }`}>
                    {displayUser.profile?.role || "spectator"}
                  </span>
                  {displayUser.email && (
                    <span className="text-gray-400">{displayUser.email}</span>
                  )}
                </div>
              </div>
            </div>

            {isOwnProfile && (
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
              >
                {isEditing ? "Cancel" : "Edit Profile"}
              </button>
            )}
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

              {displayUser.profile?.role === "singer" && (
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
              {displayUser.profile?.bio && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">About</h3>
                  <p className="text-gray-300 leading-relaxed">{displayUser.profile.bio}</p>
                </div>
              )}

              {/* Social Links */}
              {displayUser.profile?.socialLinks && Object.values(displayUser.profile.socialLinks).some(link => link) && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Social Links</h3>
                  <div className="flex flex-wrap gap-3">
                    {Object.entries(displayUser.profile.socialLinks).map(([platform, url]) =>
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
              {displayUser.profile?.role === "singer" && displayUser.profile?.ratings && (
                <div className="bg-gray-800/30 rounded-3xl p-6 border border-gray-700/50">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                    <span className="w-2 h-8 bg-cyan-500 rounded-full mr-3"></span>
                    Skill Spectrum
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div className="h-[300px]">
                      <RadarChart ratings={displayUser.profile.ratings as any} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(displayUser.profile.ratings).map(([key, value]) => (
                        <div key={key} className="bg-gray-900/40 p-4 rounded-2xl border border-gray-700/30">
                          <div className="text-sm text-gray-400 capitalize mb-1">{key}</div>
                          <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                            {(value as number).toFixed(1)}
                          </div>
                        </div>
                      ))}
                      <div className="bg-gradient-to-br from-cyan-500/10 to-purple-500/10 p-4 rounded-2xl border border-cyan-500/20 col-span-2">
                        <div className="text-sm text-cyan-300 font-semibold mb-1 uppercase tracking-wider">Overall Ranking</div>
                        <div className="text-3xl font-black text-white">
                          {(Object.values(displayUser.profile.ratings).reduce((a, b) => (a as number) + (b as number), 0) / 5).toFixed(1)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* User's songs (for singers) */}
              {displayUser.profile?.role === "singer" && (
                <div>
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                    <span className="w-2 h-8 bg-purple-500 rounded-full mr-3"></span>
                    {isOwnProfile ? "My Tracks" : "Artist Tracks"}
                  </h3>
                  {userSongs && userSongs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {userSongs.map((song: any) => (
                        <div key={song._id} className="bg-gray-800/40 p-5 rounded-2xl border border-gray-700/30 hover:border-cyan-500/30 transition-all group/track">
                          <h4 className="font-bold text-white mb-3 group-hover/track:text-cyan-400 transition-colors">{song.title}</h4>
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-4">
                              <span className="flex items-center px-2 py-1 bg-green-500/10 text-green-400 rounded-lg font-bold">
                                <span className="mr-1.5 text-xs">👍</span> {song.upvotes}
                              </span>
                              <span className="flex items-center px-2 py-1 bg-red-500/10 text-red-400 rounded-lg font-bold">
                                <span className="mr-1.5 text-xs">👎</span> {song.downvotes}
                              </span>
                            </div>
                            {song.ratings && (
                              <span className="flex items-center px-3 py-1 bg-yellow-400/10 text-yellow-400 rounded-lg font-black italic">
                                ⭐ {(Object.values(song.ratings as Record<string, number>).reduce((sum, val) => sum + val, 0) / 5).toFixed(1)}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-gray-800/20 rounded-2xl p-8 text-center border border-dashed border-gray-700">
                      <p className="text-gray-500 font-medium italic">No tracks posted yet.</p>
                    </div>
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
