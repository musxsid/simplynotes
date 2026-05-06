import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../services/notesService";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

function SignupPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSignup = async () => {
    if (!username || !password) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      await signup({ username, password });
      toast.success("Account created");
      
      // 🔥 THE CLEANUP: Wipe out the old user's data so the new user starts fresh!
      localStorage.removeItem("token");
      localStorage.removeItem("activeWorkspaceId");
      localStorage.removeItem("pinnedWorkspaceId");
      
      navigate("/login");
    } catch {
      toast.error("Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center 
    bg-gradient-to-br from-gray-100 to-gray-200 
    dark:from-gray-900 dark:to-black overflow-hidden">

      {/* Glow */}
      <div className="absolute w-[500px] h-[500px] bg-purple-500/20 blur-[140px] top-[-120px] right-[-120px] rounded-full"></div>
      <div className="absolute w-[400px] h-[400px] bg-blue-500/20 blur-[140px] bottom-[-120px] left-[-120px] rounded-full"></div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 
        border border-white/20 dark:border-gray-700 
        rounded-3xl shadow-2xl p-8 w-96 text-center"
      >

        {/* Brand */}
        <h1 className="text-2xl font-semibold mb-2 tracking-tight">
          SimplyNotes
        </h1>

        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Build your workspace, your way.
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
          onClick={handleSignup}
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded-xl 
          hover:bg-gray-800 transition active:scale-95"
        >
          {loading ? "Creating..." : "Signup"}
        </button>

        <p className="text-sm mt-5 text-gray-600 dark:text-gray-300">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-500 cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>

      </motion.div>
    </div>
  );
}

export default SignupPage;