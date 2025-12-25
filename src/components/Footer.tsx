export function Footer() {
    return (
        <footer className="mt-auto py-12 border-t border-gray-800 bg-gray-950/50 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <div className="flex flex-col items-center space-y-4">
                    <div className="text-2xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent opacity-50">
                        RakchaRap
                    </div>
                    <div className="flex flex-col space-y-1 text-xs text-gray-500 font-bold uppercase tracking-[0.2em]">
                        <span>All credits go back to <span className="text-purple-400">PsycoM</span></span>
                        <span className="opacity-60">Shout out to <span className="text-pink-500">psy4</span></span>
                    </div>
                    <div className="pt-4 text-[10px] text-gray-600 font-black uppercase tracking-[0.3em]">
                        © {new Date().getFullYear()} Made with love by <span className="text-cyan-400 font-black">Almedamo</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
