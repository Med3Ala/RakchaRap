import { SignOutButton } from "../SignOutButton";
import { NavLink } from "react-router-dom";

interface NavigationProps {
  user: any;
}

export function Navigation({ user }: NavigationProps) {
  const navItems = [
    { path: "/", id: "home", label: "Home", icon: "🏠" },
    { path: "/singers", id: "singers", label: "Artists", icon: "🎤" },
    { path: "/polls", id: "polls", label: "Polls", icon: "🗳️" },
    { path: "/profile", id: "profile", label: "Profile", icon: "👤" },
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
                <NavLink
                  key={item.id}
                  to={item.path}
                  className={({ isActive }) => `px-4 py-2 rounded-lg font-medium transition-all flex items-center ${isActive
                      ? "bg-cyan-500/20 text-cyan-400"
                      : "text-gray-300 hover:text-white hover:bg-gray-700/50"
                    }`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </NavLink>
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
