import { useState } from "react";
import { createPortal } from "react-dom";
import { RatingStars } from "./RatingStars";

interface RatingModalProps {
    song: any;
    onClose: () => void;
    onSubmit: (ratings: any) => Promise<void>;
}

export function RatingModal({ song, onClose, onSubmit }: RatingModalProps) {
    const [ratings, setRatings] = useState({
        lyrics: 0,
        beat: 0,
        flow: 0,
        style: 0,
        videoclip: 0,
    });
    const [hoverValues, setHoverValues] = useState<Record<string, number>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            await onSubmit(ratings);
            onClose();
        } catch (error) {
            // Error handled by parent toast
        } finally {
            setIsSubmitting(false);
        }
    };

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Immersive Backdrop */}
            <div
                className="absolute inset-0 bg-gray-950/90 backdrop-blur-xl animate-in fade-in duration-500"
                onClick={onClose}
            />

            {/* Modal Container */}
            <div className="relative w-full max-w-4xl bg-gray-900 rounded-[3rem] border border-gray-700/50 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-10 duration-500">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500" />

                <button
                    onClick={onClose}
                    className="absolute top-8 right-8 w-12 h-12 flex items-center justify-center rounded-2xl bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 hover:rotate-90 transition-all z-10 border border-gray-700/50"
                >
                    <span className="text-xl">✕</span>
                </button>

                <div className="flex flex-col lg:flex-row h-full min-h-[500px]">
                    {/* Left Sidebar - Artist & Song Branding */}
                    <div className="w-full lg:w-5/12 bg-gradient-to-b from-gray-800/80 to-gray-900/80 p-12 flex flex-col items-center justify-center text-center">
                        <div className="relative group mb-8">
                            <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-[2.5rem] opacity-20 blur-2xl group-hover:opacity-40 transition-opacity" />
                            <div className="relative w-48 h-48 rounded-[2rem] overflow-hidden shadow-2xl ring-4 ring-gray-800">
                                {song.thumbnail ? (
                                    <img src={song.thumbnail} alt={song.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                                ) : (
                                    <div className="w-full h-full bg-gray-800 flex items-center justify-center text-6xl">🎵</div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <span className="px-4 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-black uppercase tracking-[0.2em]">Now Rating</span>
                            <h3 className="text-3xl font-black text-white leading-tight">{song.title}</h3>
                            <p className="text-lg text-gray-400 font-medium">by <span className="text-purple-400">{song.singer?.profile?.displayName || song.singer?.name}</span></p>
                        </div>

                        <div className="mt-12 pt-12 border-t border-gray-700/50 w-full">
                            <div className="flex justify-center space-x-8">
                                <div className="text-center">
                                    <div className="text-2xl font-black text-white">{song.upvotes - song.downvotes}</div>
                                    <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Score</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-black text-white">{song.ratingCount || 0}</div>
                                    <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Ratings</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Interactive Rating Form */}
                    <div className="w-full lg:w-7/12 p-12 bg-gray-900 flex flex-col h-full">
                        <div className="mb-10">
                            <h4 className="text-2xl font-black text-white mb-2">Spectator Evaluation</h4>
                            <p className="text-gray-500 text-sm font-medium">Your expert opinion helps define the next rap legend.</p>
                        </div>

                        <div className="flex-1 space-y-8">
                            {Object.entries(ratings).map(([key, value]) => (
                                <div key={key} className="group flex flex-col">
                                    <div className="flex justify-between items-end mb-3">
                                        <div className="space-y-0.5">
                                            <label className="text-sm font-black text-gray-300 capitalize tracking-wider flex items-center">
                                                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                {key}
                                            </label>
                                            <p className="text-[10px] text-gray-600 font-bold uppercase tracking-tight">
                                                {key === 'lyrics' && 'Wordplay, Storytelling, Depth'}
                                                {key === 'beat' && 'Production, Rhythm, Texture'}
                                                {key === 'flow' && 'Delivery, Cadence, Timing'}
                                                {key === 'style' && 'Originality, Charisma, Vibe'}
                                                {key === 'videoclip' && 'Direction, Visuals, Acting'}
                                            </p>
                                        </div>
                                        <div className="flex items-baseline space-x-1">
                                            <span className={`text-2xl font-black transition-colors ${value > 0 ? 'text-yellow-400' : 'text-gray-700'}`}>
                                                {hoverValues[key] || value || 0}
                                            </span>
                                            <span className="text-xs font-bold text-gray-700">/ 5</span>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-gray-800/40 rounded-[1.5rem] border border-gray-800 group-hover:border-gray-700/50 transition-all">
                                        <RatingStars
                                            rating={value}
                                            onChange={(rating) => setRatings(prev => ({ ...prev, [key]: rating }))}
                                            onHoverChange={(h) => setHoverValues(prev => ({ ...prev, [key]: h }))}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-12 flex space-x-6">
                            <button
                                disabled={isSubmitting}
                                onClick={onClose}
                                className="px-8 py-5 bg-transparent text-gray-500 font-black rounded-3xl hover:text-white transition-all uppercase tracking-widest text-xs"
                            >
                                Dismiss
                            </button>
                            <button
                                disabled={isSubmitting}
                                onClick={handleSubmit}
                                className="flex-1 py-5 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white font-black rounded-3xl hover:shadow-[0_20px_40px_rgba(168,85,247,0.3)] hover:-translate-y-1 active:translate-y-0 transition-all uppercase tracking-widest text-xs disabled:opacity-50 disabled:translate-y-0"
                            >
                                {isSubmitting ? 'Recording...' : 'Finalize Rating'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}
