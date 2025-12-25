import { SignOutButton } from "../SignOutButton";

interface NavigationProps {
  currentPage: string;
  setCurrentPage: (page: "home" | "profile" | "singers" | "polls") => void;
  user: any;
}

export function Navigation({ currentPage, setCurrentPage, user }: NavigationProps) {
  const navItems = [
    { id: "home", label: "Home", icon: "🏠" },
    { id: "singers", label: "Artists", icon: "🎤" },
    { id: "polls", label: "Polls", icon: "🗳️" },
    { id: "profile", label: "Profile", icon: "👤" },
  ];
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-sm border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              RakchaRap
            </h1>
            
            <div className="hidden md:flex space-x-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id as any)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    currentPage === item.id
                      ? "bg-cyan-500/20 text-cyan-400"
                      : "text-gray-300 hover:text-white hover:bg-gray-700/50"
                  }`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-300">
              <span className="text-cyan-400">{user.profile?.role}</span>
              {user.profile?.displayName && (
                <span className="ml-2">{user.profile.displayName}</span>
              )}
            </div>
            <SignOutButton />
          </div>
        </div>
      </div>
    </nav>
  );
}
