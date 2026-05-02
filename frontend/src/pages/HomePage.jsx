import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen overflow-hidden 
    bg-gradient-to-br from-gray-100 to-gray-200 
    dark:from-gray-900 dark:to-black 
    text-gray-900 dark:text-white">

      {/* 🔥 BACKGROUND GLOW */}
      <div className="absolute w-[500px] h-[500px] bg-blue-500/20 blur-[120px] top-[-100px] left-[-100px] rounded-full"></div>
      <div className="absolute w-[400px] h-[400px] bg-purple-500/20 blur-[120px] bottom-[-100px] right-[-100px] rounded-full"></div>

      {/* NAVBAR */}
      <div className="flex justify-between items-center px-10 py-6 relative z-10">
        <h1 className="text-xl font-semibold tracking-tight">SimplyNotes</h1>

        <div className="flex gap-4">
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-800 transition"
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

      {/* HERO */}
      <div className="flex flex-col items-center text-center mt-20 px-6 relative z-10">

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-6xl font-bold leading-tight mb-6"
        >
          The Future of <br /> Work, Organized by AI
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="max-w-2xl text-lg text-gray-600 dark:text-gray-300 mb-8"
        >
          Manage notes, emails, schedules, and collaboration — powered by one intelligent AI system.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex gap-4"
        >
          <button
            onClick={() => navigate("/signup")}
            className="bg-black text-white px-7 py-3 rounded-xl hover:bg-gray-800 transition active:scale-95"
          >
            Start Free
          </button>

          <button
            onClick={() => navigate("/login")}
            className="px-7 py-3 rounded-xl border border-gray-300 dark:border-gray-600"
          >
            Login
          </button>
        </motion.div>
      </div>

      {/* FLOATING MOCK UI */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 4 }}
        className="mt-20 flex justify-center px-6 relative z-10"
      >
        <div className="w-full max-w-5xl backdrop-blur-xl bg-white/60 dark:bg-gray-800/60 border border-white/20 dark:border-gray-700 rounded-3xl shadow-2xl p-6">

          <div className="text-sm text-gray-500 mb-2">
            Workspace Preview
          </div>

          <div className="bg-gray-100 dark:bg-gray-700 h-64 rounded-xl flex items-center justify-center">
            <span className="text-gray-400">
              Your AI workspace will appear here
            </span>
          </div>

        </div>
      </motion.div>

      {/* FEATURES */}
      <div className="mt-32 px-10 grid md:grid-cols-3 gap-8 relative z-10">

        {[
          {
            title: "Smart Notes",
            desc: "Rich editing, media support, AI summaries."
          },
          {
            title: "AI Brain",
            desc: "One AI agent across notes, emails, and calendar."
          },
          {
            title: "Workspaces",
            desc: "Collaborate, organize, and scale your workflow."
          },
        ].map((item, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -8 }}
            className="p-6 backdrop-blur-xl bg-white/60 dark:bg-gray-800/60 border border-white/20 dark:border-gray-700 rounded-2xl shadow"
          >
            <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
            <p className="text-gray-600 dark:text-gray-400">
              {item.desc}
            </p>
          </motion.div>
        ))}

      </div>

      {/* FUTURE VISION */}
      <div className="mt-32 text-center px-6 relative z-10">
        <h2 className="text-3xl font-semibold mb-6">
          Built for What’s Next
        </h2>

        <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
          Email integration, calendar intelligence, AI-driven scheduling, and
          automation — all unified into one seamless experience.
        </p>
      </div>

      {/* CTA */}
      <div className="mt-32 mb-20 text-center relative z-10">
        <button
          onClick={() => navigate("/signup")}
          className="bg-black text-white px-10 py-4 rounded-2xl text-lg hover:bg-gray-800 transition active:scale-95"
        >
          Start Building Your Workflow
        </button>
      </div>

    </div>
  );
}

export default HomePage;