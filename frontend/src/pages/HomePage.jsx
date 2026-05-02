import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white">

      {/* NAVBAR */}
      <div className="flex justify-between items-center px-10 py-5">
        <h1 className="text-xl font-semibold tracking-tight">SimplyNotes</h1>

        <div className="flex gap-4">
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600"
          >
            Login
          </button>

          <button
            onClick={() => navigate("/signup")}
            className="px-4 py-2 rounded-lg bg-black text-white hover:bg-gray-800"
          >
            Get Started
          </button>
        </div>
      </div>

      {/* HERO */}
      <div className="flex flex-col items-center text-center mt-24 px-6">

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl font-bold mb-6 leading-tight"
        >
          Your Complete AI Work OS
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="max-w-2xl text-gray-600 dark:text-gray-300 mb-8 text-lg"
        >
          Notes, tasks, emails, calendar, and AI — all in one intelligent workspace designed for productivity.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex gap-4"
        >
          <button
            onClick={() => navigate("/signup")}
            className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition active:scale-95"
          >
            Start Free
          </button>

          <button
            onClick={() => navigate("/login")}
            className="border px-6 py-3 rounded-xl"
          >
            Login
          </button>
        </motion.div>

      </div>

      {/* PRODUCT VISUAL */}
      <div className="mt-24 flex justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-5xl bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6"
        >
          <div className="text-left text-sm text-gray-500 mb-2">
            Dashboard Preview
          </div>

          <div className="bg-gray-100 dark:bg-gray-700 h-64 rounded-xl flex items-center justify-center">
            <span className="text-gray-400">
              (Your App UI Preview Here)
            </span>
          </div>
        </motion.div>
      </div>

      {/* FEATURES */}
      <div className="mt-32 px-10 grid md:grid-cols-3 gap-8">

        {[
          {
            title: "Smart Notes",
            desc: "Create rich notes with media, AI summaries, and powerful editing tools."
          },
          {
            title: "Workspaces",
            desc: "Collaborate with teams, organize projects, and manage workflows."
          },
          {
            title: "AI Assistant",
            desc: "Summarize notes, manage tasks, analyze emails, and plan your day."
          },
        ].map((item, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -6 }}
            className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow"
          >
            <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
            <p className="text-gray-500 dark:text-gray-400">
              {item.desc}
            </p>
          </motion.div>
        ))}

      </div>

      {/* FUTURE VISION */}
      <div className="mt-32 text-center px-6">
        <h2 className="text-3xl font-semibold mb-6">
          Built for the Future of Work
        </h2>

        <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
          SimplyNotes evolves into a complete productivity system with email integration,
          calendar planning, intelligent AI agents, and automation workflows — all unified.
        </p>
      </div>

      {/* CTA */}
      <div className="mt-32 mb-20 text-center">
        <button
          onClick={() => navigate("/signup")}
          className="bg-black text-white px-8 py-4 rounded-2xl text-lg hover:bg-gray-800 transition active:scale-95"
        >
          Get Started for Free
        </button>
      </div>

    </div>
  );
}

export default HomePage;