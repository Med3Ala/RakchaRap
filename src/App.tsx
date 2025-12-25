import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { HomePage } from "./components/HomePage";
import { ProfilePage } from "./components/ProfilePage";
import { SingersPage } from "./components/SingersPage";
import { PollsPage } from "./components/PollsPage";
import { ProfileSetup } from "./components/ProfileSetup";
import { Navigation } from "./components/Navigation";
import { useState } from "react";

export default function App() {
  const [currentPage, setCurrentPage] = useState<"home" | "profile" | "singers" | "polls">("home");
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <Authenticated>
        <AuthenticatedApp currentPage={currentPage} setCurrentPage={setCurrentPage} />
      </Authenticated>
      <Unauthenticated>
        <UnauthenticatedApp />
      </Unauthenticated>
      <Toaster theme="dark" />
    </div>
  );
}

function AuthenticatedApp({ currentPage, setCurrentPage }: { 
  currentPage: string; 
  setCurrentPage: (page: "home" | "profile" | "singers" | "polls") => void;
}) {
  const user = useQuery(api.users.getCurrentUser);
  
  if (user === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
      </div>
    );
  }
  
  if (!user?.profile) {
    return <ProfileSetup />;
  }
  
  return (
    <div className="min-h-screen">
      <Navigation 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage}
        user={user}
      />
      <main className="pt-20">
        {currentPage === "home" && <HomePage />}
        {currentPage === "profile" && <ProfilePage />}
        {currentPage === "singers" && <SingersPage />}
        {currentPage === "polls" && <PollsPage />}
      </main>
    </div>
  );
}

function UnauthenticatedApp() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4">
            RakchaRap
          </h1>
          <p className="text-xl text-gray-300">
            The Ultimate Rap Community Platform
          </p>
          <p className="text-gray-400 mt-2">
            Connect, Share, and Rate the Best Rap Music
          </p>
        </div>
        <SignInForm />
      </div>
    </div>
  );
}
