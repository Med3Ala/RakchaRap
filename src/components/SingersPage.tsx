import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { RadarChart } from "./RadarChart";

export function SingersPage() {
  const singers = useQuery(api.users.getSingers);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Featured Artists</h1>
        <p className="text-gray-400">Discover talented rap artists in our community</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {singers?.map((singer) => (
          <div key={singer._id} className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                {(singer.displayName || singer.user?.name || "U").charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">
                  {singer.displayName || singer.user?.name}
                </h3>
                <p className="text-cyan-400 text-sm">Artist</p>
              </div>
            </div>

            {singer.bio && (
              <p className="text-gray-300 text-sm mb-4 line-clamp-3">{singer.bio}</p>
            )}

            {singer.ratings && (
              <div className="mb-4">
                <div className="grid grid-cols-5 gap-2 text-xs">
                  {Object.entries(singer.ratings).map(([key, value]) => (
                    <div key={key} className="text-center">
                      <div className="text-gray-400 capitalize">{key}</div>
                      <div className="text-white font-medium">{(value as number).toFixed(1)}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {singer.socialLinks && Object.values(singer.socialLinks).some(link => link) && (
              <div className="flex flex-wrap gap-2">
                {Object.entries(singer.socialLinks).map(([platform, url]) =>
                  url ? (
                    <a
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2 py-1 bg-gray-700 text-cyan-400 text-xs rounded hover:bg-gray-600 transition-colors capitalize"
                    >
                      {platform}
                    </a>
                  ) : null
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {singers?.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎤</div>
          <h3 className="text-xl font-semibold text-gray-300 mb-2">No artists yet</h3>
          <p className="text-gray-500">Be the first to join as a singer!</p>
        </div>
      )}
    </div>
  );
}
