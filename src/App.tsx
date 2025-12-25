import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { Toaster } from "sonner";
import { HomePage } from "./components/HomePage";
import { ProfilePage } from "./components/ProfilePage";
import { SingersPage } from "./components/SingersPage";
import { PollsPage } from "./components/PollsPage";
import { ProfileSetup } from "./components/ProfileSetup";
import { Navigation } from "./components/Navigation";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <BrowserRouter>
        <Authenticated>
          <AuthenticatedApp />
        </Authenticated>
        <Unauthenticated>
          <UnauthenticatedApp />
        </Unauthenticated>
      </BrowserRouter>
      <Toaster theme="dark" />
    </div>
  );
}

function AuthenticatedApp() {
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
      <Navigation user={user} />
      <main className="pt-20">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/:userId" element={<ProfilePage />} />
          <Route path="/singers" element={<SingersPage />} />
          <Route path="/polls" element={<PollsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
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
