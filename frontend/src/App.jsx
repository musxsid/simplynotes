import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import WorkPage from "./pages/WorkPage";
import ProtectedRoute from "./routes/ProtectedRoute";
function App() {
  const token = localStorage.getItem("token");

  return (
    <Router>
      <Routes>

        {/* 🔥 Root route logic */}
        <Route
          path="/"
          element={token ? <Navigate to="/work" /> : <LoginPage />}
        />

        {/* Signup */}
        <Route path="/signup" element={<SignupPage />} />

        {/* Protected Work */}
        <Route
          path="/work"
          element={
            <ProtectedRoute>
              <WorkPage />
            </ProtectedRoute>
          }
        />

      </Routes>
    </Router>
  );
}

export default App;