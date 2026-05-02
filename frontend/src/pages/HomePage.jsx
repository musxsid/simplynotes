import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen overflow-hidden 
    bg-gradient-to-br from-gray-100 to-gray-200 
    dark:from-gray-900 dark:to-black 
    text-gray-900 dark:text-white">

      {/* Glow */}
      <div className="absolute w-[500px] h-[500px] bg-blue-500/20 blur-[120px] top-[-100px] left-[-100px] rounded-full"></div>
      <div className="absolute w-[400px] h-[400px] bg-purple-500/20 blur-[120px] bottom-[-100px] right-[-100px] rounded-full"></div>

      {/* Navbar */}
      <div className="flex justify-between items-center px-10 py-6 relative z-10">
        <h1 className="text-xl font-semibold">SimplyNotes</h1>

        <div className="flex gap-4">
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 rounded-lg border 
            border-gray-300 dark:border-gray-600 
            hover:bg-gray-200 dark:hover:bg-gray-800 transition"
          >
            Login
          </button>

          <button
            onClick={() => navigate("/signup")}
            className="px-5 py-2 rounded-lg bg-black text-white hover:bg-gray-800 transition"
          >
            Get Started
          </button>
        </div>
      </div>

      {/* Hero */}
      <div className="flex flex-col items-center text-center mt-20 px-6 relative z-10">

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-6xl font-bold mb-6"
        >
          The Future of <br /> Work, Organized by AI
        </motion.h1>

        <p className="max-w-2xl text-lg text-gray-600 dark:text-gray-300 mb-8">
          Manage notes, emails, schedules, and collaboration — powered by one intelligent AI system.
        </p>

        <div className="flex gap-4">
          <button
            onClick={() => navigate("/signup")}
            className="bg-black text-white px-7 py-3 rounded-xl hover:bg-gray-800"
          >
            Start Free
          </button>

          <button
            onClick={() => navigate("/login")}
            className="px-7 py-3 rounded-xl border border-gray-300 dark:border-gray-600"
          >
            Login
          </button>
        </div>
      </div>

    </div>
  );
}

export default HomePage;