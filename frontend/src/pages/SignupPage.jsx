import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import axios from "axios";

const signup = async (data) => {
  return axios.post("http://localhost:8080/api/auth/register", data);
};

function SignupPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSignup = async () => {
    if (!username || !password || !firstName || !lastName || !email) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      await signup({ firstName, lastName, email, username, password });
      toast.success("Account created successfully!");
      
      localStorage.removeItem("token");
      localStorage.removeItem("activeWorkspaceId");
      localStorage.removeItem("pinnedWorkspaceId");
      
      navigate("/login");
    } catch (err) {
      const errorMsg = err.response?.data || "Signup failed";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full mb-3 p-2 rounded-lg border bg-white dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500";

  return (
    <div className="relative min-h-screen flex items-center justify-center 
    bg-gradient-to-br from-gray-100 to-gray-200 
    dark:from-gray-900 dark:to-black overflow-hidden">

      {/* Glow - Kept original styling for brand consistency */}
      <div className="absolute w-[500px] h-[500px] bg-purple-500/20 blur-[140px] top-[-120px] right-[-120px] rounded-full"></div>
      <div className="absolute w-[400px] h-[400px] bg-blue-500/20 blur-[140px] bottom-[-120px] left-[-120px] rounded-full"></div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 
        border border-white/20 dark:border-gray-700 
        rounded-3xl shadow-2xl p-8 w-[420px] text-center z-10"
      >

        {/* Brand Header */}
        <h1 className="text-2xl font-semibold mb-2 tracking-tight">
          SimplyNotes
        </h1>

        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Build your workspace, your way.
        </p>

        {/* Profile Name Grid */}
        <div className="flex gap-2">
           <input
            type="text"
            placeholder="First Name"
            className={inputClass}
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Last Name"
            className={inputClass}
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>

        {/* Email Address */}
        <input
          type="email"
          placeholder="Email Address"
          className={inputClass}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Authentication Credentials */}
        <input
          type="text"
          placeholder="Username"
          className={inputClass}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-6 p-2 rounded-lg border bg-white dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleSignup}
          disabled={loading}
          className="w-full bg-black dark:bg-white dark:text-black text-white py-2.5 rounded-xl 
          hover:bg-gray-800 dark:hover:bg-gray-200 transition active:scale-95 font-bold shadow-lg"
        >
          {loading ? "Creating account..." : "Sign up"}
        </button>

        <p className="text-sm mt-5 text-gray-600 dark:text-gray-300">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-500 cursor-pointer hover:underline font-medium"
          >
            Log in
          </span>
        </p>

      </motion.div>
    </div>
  );
}

export default SignupPage;