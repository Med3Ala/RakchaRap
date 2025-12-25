import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { RadarChart } from "./RadarChart";
import { RatingModal } from "./RatingModal";
import { toast } from "sonner";

export function SongDetailPage() {
    const { songId } = useParams<{ songId: string }>();
    const [showRating, setShowRating] = useState(false);

    const song = useQuery(api.songs.getSongById, { songId: songId as Id<"songs"> });
    const rateSong = useMutation(api.songs.rateSong);
    const voteSong = useMutation(api.songs.voteSong);

    const handleRatingSubmit = async (ratings: any) => {
        if (!song) return;
        try {
            await rateSong({
                songId: song._id,
                ...ratings
            });
            toast.success("Rating submitted successfully!");
        } catch (error) {
            toast.error("Failed to submit rating");
            throw error;
        }
    };

    const handleVote = async (type: "upvote" | "downvote") => {
        if (!song) return;
        try {
            await voteSong({ songId: song._id, type });
            toast.success(`${type === "upvote" ? "Upvoted" : "Downvoted"} successfully!`);
        } catch (error) {
            toast.error("Failed to vote");
        }
    };

    if (song === undefined) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
            </div>
        );
    }

    if (song === null) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
                <div className="text-6xl mb-4">🎵</div>
                <h2 className="text-2xl font-bold text-white mb-2">Song not found</h2>
                <p className="text-gray-400">The song you are looking for does not exist or has been removed.</p>
                <Link to="/" className="mt-6 text-cyan-400 hover:underline">Return to Home</Link>
            </div>
        );
    }

    const averageRating = song.ratings
        ? (Object.values(song.ratings) as number[]).reduce((sum, val) => sum + val, 0) / 5
        : 0;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Left Side: Thumbnail & Interaction */}
                <div className="w-full lg:w-1/3 xl:w-1/4">
                    <div className="sticky top-24 space-y-6">
                        <div className="relative aspect-square rounded-[2rem] overflow-hidden shadow-2xl ring-1 ring-gray-700">
                            {song.thumbnail ? (
                                <img src={song.thumbnail} alt={song.title} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-gray-800 flex items-center justify-center text-6xl">🎵</div>
                            )}
                            <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-gray-950 to-transparent">
                                <button
                                    onClick={() => window.open(song.youtubeUrl, '_blank')}
                                    className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-black rounded-2xl flex items-center justify-center space-x-2 transition-all shadow-xl"
                                >
                                    <span className="text-xl">▶</span>
                                    <span>WATCH ON YOUTUBE</span>
                                </button>
                            </div>
                        </div>

                        <div className="bg-gray-800/40 backdrop-blur-xl rounded-[2rem] p-6 border border-gray-700/50">
                            <div className="flex justify-around mb-6">
                                <button
                                    onClick={() => handleVote("upvote")}
                                    className="group flex flex-col items-center space-y-1"
                                >
                                    <div className="w-12 h-12 rounded-2xl bg-gray-900 flex items-center justify-center text-green-400 group-hover:bg-green-500/20 transition-all border border-gray-700">👍</div>
                                    <span className="text-sm font-black text-gray-400">{song.upvotes}</span>
                                </button>
                                <button
                                    onClick={() => handleVote("downvote")}
                                    className="group flex flex-col items-center space-y-1"
                                >
                                    <div className="w-12 h-12 rounded-2xl bg-gray-900 flex items-center justify-center text-red-400 group-hover:bg-red-500/20 transition-all border border-gray-700">👎</div>
                                    <span className="text-sm font-black text-gray-400">{song.downvotes}</span>
                                </button>
                            </div>

                            <button
                                onClick={() => setShowRating(true)}
                                className="w-full py-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black rounded-2xl hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all shadow-lg uppercase tracking-widest text-xs"
                            >
                                Evaluate Performance
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Side: Details & Stats */}
                <div className="flex-1 space-y-8">
                    <div className="bg-gray-800/20 backdrop-blur-xl rounded-[2.5rem] p-8 lg:p-12 border border-gray-700/30">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                            <div className="space-y-4">
                                <div className="flex items-center space-x-3">
                                    <span className="px-3 py-1 bg-cyan-500/10 text-cyan-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-cyan-500/20">Song Detail</span>
                                    <span className="text-gray-500 text-xs font-bold uppercase tracking-widest">
                                        Posted {new Date(song._creationTime).toLocaleDateString()}
                                    </span>
                                </div>
                                <h1 className="text-5xl lg:text-6xl font-black text-white leading-tight">
                                    {song.title}
                                </h1>
                                <Link
                                    to={`/profile/${song.singerId}`}
                                    className="group flex items-center space-x-4 inline-flex"
                                >
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center text-white font-bold ring-2 ring-transparent group-hover:ring-cyan-500/50 transition-all">
                                        {(song.singer?.profile?.displayName || song.singer?.name || "U").charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <span className="text-gray-500 text-xs font-black uppercase tracking-widest block">Performed by</span>
                                        <span className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                                            {song.singer?.profile?.displayName || song.singer?.name}
                                        </span>
                                    </div>
                                </Link>
                            </div>

                            <div className="flex items-center space-x-4">
                                <div className="bg-gray-900/60 p-6 rounded-[2rem] border border-gray-700 text-center">
                                    <div className="text-4xl font-black text-white">{averageRating.toFixed(1)}</div>
                                    <div className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-1">Global Score</div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 items-center border-t border-gray-700/50 pt-12">
                            <div className="h-[400px]">
                                <RadarChart ratings={song.ratings as any} />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                {song.ratings && Object.entries(song.ratings).map(([key, value]) => (
                                    <div key={key} className="bg-gray-900/40 p-6 rounded-[2rem] border border-gray-700/30 flex flex-col justify-center">
                                        <div className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-2">{key}</div>
                                        <div className="flex items-baseline space-x-2">
                                            <div className="text-3xl font-black text-white">{(value as number).toFixed(1)}</div>
                                            <div className="text-xs text-gray-600 font-bold">/ 5.0</div>
                                        </div>
                                        <div className="mt-4 h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full transition-all duration-1000"
                                                style={{ width: `${(value as number) * 20}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Lyrics Section */}
                    {song.lyrics && (
                        <div className="bg-gray-800/20 backdrop-blur-xl rounded-[2.5rem] p-8 lg:p-12 border border-gray-700/30">
                            <h2 className="text-2xl font-black text-white mb-8 flex items-center">
                                <span className="w-2 h-8 bg-pink-500 rounded-full mr-4"></span>
                                Official Lyrics
                            </h2>
                            <div className="prose prose-invert max-w-none">
                                <pre className="text-lg text-gray-300 font-medium leading-relaxed font-sans whitespace-pre-wrap">
                                    {song.lyrics}
                                </pre>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {showRating && (
                <RatingModal
                    song={song}
                    onClose={() => setShowRating(false)}
                    onSubmit={handleRatingSubmit}
                />
            )}
        </div>
    );
}
