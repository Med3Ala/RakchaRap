import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { Link } from "react-router-dom";

interface SongCardProps {
  song: any;
  onRateClick: (song: any) => void;
}

export function SongCard({ song, onRateClick }: SongCardProps) {
  const voteSong = useMutation(api.songs.voteSong);

  const handleVote = async (type: "upvote" | "downvote") => {
    try {
      await voteSong({ songId: song._id, type });
      toast.success(`${type === "upvote" ? "Upvoted" : "Downvoted"} successfully!`);
    } catch (error) {
      toast.error("Failed to vote");
    }
  };

  const averageRating = song.ratings
    ? (Object.values(song.ratings) as number[]).reduce((sum: number, val: number) => sum + val, 0) / 5
    : 0;

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700 hover:border-gray-600 transition-all group">
      {/* Thumbnail */}
      <Link to={`/song/${song._id}`} className="block relative aspect-video bg-gray-700 overflow-hidden">
        {song.thumbnail ? (
          <img
            src={song.thumbnail}
            alt={song.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-4xl">🎵</div>
          </div>
        )}

        {/* Play overlay */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center text-white text-2xl shadow-xl">
            ▶️
          </div>
        </div>
      </Link>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <Link to={`/song/${song._id}`}>
              <h3 className="text-lg font-semibold text-white truncate hover:text-cyan-400 transition-colors uppercase tracking-tight">{song.title}</h3>
            </Link>
            <Link to={`/profile/${song.singerId}`}>
              <p className="text-cyan-400 text-sm font-medium hover:underline">
                {song.singer?.profile?.displayName || song.singer?.name}
              </p>
            </Link>
          </div>

          {averageRating > 0 && (
            <div className="flex items-center space-x-1">
              <span className="text-yellow-400">⭐</span>
              <span className="text-white font-medium">{averageRating.toFixed(1)}</span>
            </div>
          )}
        </div>

        {/* Ratings breakdown */}
        {song.ratings && (
          <div className="mb-4">
            <div className="grid grid-cols-5 gap-2 text-xs">
              {Object.entries(song.ratings).map(([key, value]) => (
                <div key={key} className="text-center">
                  <div className="text-gray-400 capitalize">{key}</div>
                  <div className="text-white font-medium">{(value as number).toFixed(1)}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => handleVote("upvote")}
              className="flex items-center space-x-1 text-green-400 hover:text-green-300 transition-colors"
            >
              <span>👍</span>
              <span className="text-sm">{song.upvotes}</span>
            </button>

            <button
              onClick={() => handleVote("downvote")}
              className="flex items-center space-x-1 text-red-400 hover:text-red-300 transition-colors"
            >
              <span>👎</span>
              <span className="text-sm">{song.downvotes}</span>
            </button>
          </div>

          <button
            onClick={() => onRateClick(song)}
            className="px-3 py-1 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors"
          >
            Rate
          </button>
        </div>

        {/* Lyrics preview */}
        {song.lyrics && (
          <div className="mt-4 p-3 bg-gray-700/50 rounded-lg">
            <p className="text-gray-300 text-sm line-clamp-3">{song.lyrics}</p>
          </div>
        )}
      </div>
    </div>
  );
}
