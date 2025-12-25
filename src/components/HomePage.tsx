import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { SongCard } from "./SongCard";
import { SongPostForm } from "./SongPostForm";
import { RatingModal } from "./RatingModal";
import { toast } from "sonner";

export function HomePage() {
  const [sortBy, setSortBy] = useState<"rating" | "votes" | "date" | "singer">("date");
  const [search, setSearch] = useState("");
  const [showPostForm, setShowPostForm] = useState(false);
  const [selectedSong, setSelectedSong] = useState<any>(null);

  const songs = useQuery(api.songs.getAllSongs, { sortBy, search: search || undefined });
  const currentUser = useQuery(api.users.getCurrentUser);
  const rateSong = useMutation(api.songs.rateSong);

  const handleRatingSubmit = async (ratings: any) => {
    if (!selectedSong) return;
    try {
      await rateSong({
        songId: selectedSong._id,
        ...ratings
      });
      toast.success("Rating submitted successfully!");
    } catch (error) {
      toast.error("Failed to submit rating");
      throw error;
    }
  };

  const canPostSongs = currentUser?.profile?.role === "singer";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Latest Tracks</h1>
              <p className="text-gray-400">Discover the hottest rap songs from our community</p>
            </div>

            {canPostSongs && (
              <button
                onClick={() => setShowPostForm(true)}
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold rounded-lg hover:from-cyan-600 hover:to-purple-600 transition-all"
              >
                Post New Track
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 mb-8 border border-gray-700">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search tracks..."
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none"
                />
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none"
              >
                <option value="date">Latest</option>
                <option value="rating">Top Rated</option>
                <option value="votes">Most Voted</option>
                <option value="singer">By Artist</option>
              </select>
            </div>
          </div>

          {/* Songs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {songs?.map((song) => (
              <SongCard key={song._id} song={song} onRateClick={setSelectedSong} />
            ))}
          </div>

          {songs?.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎵</div>
              <h3 className="text-xl font-semibold text-gray-300 mb-2">No tracks found</h3>
              <p className="text-gray-500">
                {search ? "Try adjusting your search terms" : "Be the first to post a track!"}
              </p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-80">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">🔥 Trending Now</h3>
            <div className="space-y-3">
              {songs?.slice(0, 5).map((song, index) => (
                <div key={song._id} className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">{song.title}</p>
                    <p className="text-gray-400 text-sm truncate">
                      {song.singer?.profile?.displayName || song.singer?.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Post Form Modal */}
      {showPostForm && (
        <SongPostForm onClose={() => setShowPostForm(false)} />
      )}

      {/* Rating Modal */}
      {selectedSong && (
        <RatingModal
          song={selectedSong}
          onClose={() => setSelectedSong(null)}
          onSubmit={handleRatingSubmit}
        />
      )}
    </div>
  );
}
