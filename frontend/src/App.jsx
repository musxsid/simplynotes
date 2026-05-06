import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import Sidebar from "./components/layout/Sidebar";
import ProtectedRoute from "./routes/ProtectedRoute";
import OmniSearch from "./components/ui/OmniSearch";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import NoteEditorPage from "./pages/NoteEditorPage";
import WorkspacesHubPage from "./pages/WorkspacesHubPage"; 

// 🔥 CRITICAL: Make sure PublicNotePage is imported!
import PublicNotePage from "./pages/PublicNotePage"; 

const NO_SIDEBAR_ROUTES = ["/", "/login", "/signup"];

function AppLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  // 🔥 THE FIX: This tells React to HIDE the sidebar if the URL contains "/share"
  const hideSidebar = NO_SIDEBAR_ROUTES.includes(location.pathname) || location.pathname.startsWith('/share');

  if (hideSidebar) {
    return <div className="app-bg min-h-screen">{children}</div>;
  }

  return (
    <div className="app-bg flex">
      <Sidebar onNewNote={() => navigate("/notes/new")} />
      <div className="ml-64 flex-1 min-h-screen px-6 py-6">
        <div className="max-w-6xl mx-auto w-full">
          {children}
        </div>
      </div>
    </div>
  );
}

function App() {
  const location = useLocation();
  
  // 🔥 THE FIX: Also hide the Ctrl+K search bar for public users!
  const isPublicRoute = location.pathname.startsWith('/share');

  return (
    <>
      {!isPublicRoute && <OmniSearch />}
      <AppLayout>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/notes/:id" element={<ProtectedRoute><NoteEditorPage /></ProtectedRoute>} />
            <Route path="/workspaces" element={<ProtectedRoute><WorkspacesHubPage /></ProtectedRoute>} />
            
            {/* 🔥 THE FIX: This registers the public page so it stops showing a blank screen */}
            <Route path="/share/:token" element={<PublicNotePage />} />
          </Routes>
        </AnimatePresence>
      </AppLayout>
    </>
  );
}

export default App;