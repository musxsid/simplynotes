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
// 🔥 Import the new hub page
import WorkspacesHubPage from "./pages/WorkspacesHubPage"; 

const NO_SIDEBAR_ROUTES = ["/", "/login", "/signup"];

function AppLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  const hideSidebar = NO_SIDEBAR_ROUTES.includes(location.pathname);

  if (hideSidebar) {
    return <div className="app-bg">{children}</div>;
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

  return (
    <>
      <OmniSearch />
      <AppLayout>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/notes/:id" element={<ProtectedRoute><NoteEditorPage /></ProtectedRoute>} />
            
            {/* 🔥 The New Hub Route */}
            <Route path="/workspaces" element={<ProtectedRoute><WorkspacesHubPage /></ProtectedRoute>} />
          </Routes>
        </AnimatePresence>
      </AppLayout>
    </>
  );
}

export default App;