import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

export function ProfileSetup() {
  const [role, setRole] = useState<"singer" | "spectator" | "admin">("spectator");
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [socialLinks, setSocialLinks] = useState({
    instagram: "",
    twitter: "",
    youtube: "",
    spotify: "",
  });
  
  const createProfile = useMutation(api.users.createProfile);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createProfile({
        role,
        displayName: displayName || undefined,
        bio: bio || undefined,
        socialLinks: Object.values(socialLinks).some(link => link) ? socialLinks : undefined,
      });
      toast.success("Profile created successfully!");
    } catch (error) {
      toast.error("Failed to create profile");
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="w-full max-w-2xl bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">
            Welcome to RakchaRap
          </h1>
          <p className="text-gray-300">Let's set up your profile</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Choose your role
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { value: "spectator", label: "Spectator", desc: "Listen, rate, and comment" },
                { value: "singer", label: "Singer", desc: "Post songs and build your profile" },
                { value: "admin", label: "Admin", desc: "Manage polls and community" },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setRole(option.value as any)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    role === option.value
                      ? "border-cyan-400 bg-cyan-400/10"
                      : "border-gray-600 hover:border-gray-500"
                  }`}
                >
                  <div className="text-white font-semibold">{option.label}</div>
                  <div className="text-sm text-gray-400 mt-1">{option.desc}</div>
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Display Name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none"
              placeholder="Your stage name or display name"
            />
          </div>
          
          {role === "singer" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Bio
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none"
                  placeholder="Tell us about your music style and journey..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Social Links (Optional)
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(socialLinks).map(([platform, value]) => (
                    <input
                      key={platform}
                      type="url"
                      value={value}
                      onChange={(e) => setSocialLinks(prev => ({ ...prev, [platform]: e.target.value }))}
                      className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none"
                      placeholder={`${platform.charAt(0).toUpperCase() + platform.slice(1)} URL`}
                    />
                  ))}
                </div>
              </div>
            </>
          )}
          
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold rounded-lg hover:from-cyan-600 hover:to-purple-600 transition-all"
          >
            Create Profile
          </button>
        </form>
      </div>
    </div>
  );
}
