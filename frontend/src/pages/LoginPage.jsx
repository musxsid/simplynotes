import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/notesService";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username || !password) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      const res = await login({ username, password });
      localStorage.setItem("token", res.data.token);
      toast.success("Welcome back");
      
      //  PINNING LOGIC: Check if they have a pinned workspace
      const pinnedWorkspaceId = localStorage.getItem("pinnedWorkspaceId");
      if (pinnedWorkspaceId) {
        localStorage.setItem("activeWorkspaceId", pinnedWorkspaceId);
        navigate("/dashboard"); // Teleport directly to their pinned workspace
      } else {
        navigate("/workspaces"); // Otherwise, show them the Hub
      }
      
    } catch {
      toast.error("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center 
    bg-gradient-to-br from-gray-100 to-gray-200 
    dark:from-gray-900 dark:to-black overflow-hidden">

      <div className="absolute w-[500px] h-[500px] bg-blue-500/20 blur-[140px] top-[-120px] left-[-120px] rounded-full"></div>
      <div className="absolute w-[400px] h-[400px] bg-purple-500/20 blur-[140px] bottom-[-120px] right-[-120px] rounded-full"></div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 
        border border-white/20 dark:border-gray-700 
        rounded-3xl shadow-2xl p-8 w-96 text-center"
      >
        <h1 className="text-2xl font-semibold mb-2 tracking-tight">
          SimplyNotes
        </h1>

        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Your workspace, organized quietly.
        </p>

        <input
          type="text"
          placeholder="Username"
          className="w-full mb-3 p-2 rounded-lg border 
          bg-white dark:bg-gray-700 
          text-gray-800 dark:text-white 
          border-gray-300 dark:border-gray-600"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-2 rounded-lg border 
          bg-white dark:bg-gray-700 
          text-gray-800 dark:text-white 
          border-gray-300 dark:border-gray-600"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded-xl 
          hover:bg-gray-800 transition active:scale-95"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-sm mt-5 text-gray-600 dark:text-gray-300">
          New here?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-blue-500 cursor-pointer hover:underline"
          >
            Create account
          </span>
        </p>

      </motion.div>
    </div>
  );
}

export default LoginPage;