import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

function HomePage() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "light") setDarkMode(false);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  return (
    <div
      className={`
      min-h-screen overflow-x-hidden transition-colors duration-500
      ${
        darkMode
          ? "bg-gradient-to-br from-[#0b1220] via-[#0f172a] to-black text-white"
          : "bg-gradient-to-br from-gray-100 via-white to-gray-200 text-gray-900"
      }
    `}
    >
      {/* 🌌 Background Glow */}
      {darkMode && (
        <>
          <div className="absolute w-[500px] h-[500px] bg-blue-500/20 blur-[120px] top-[-150px] left-[-150px]" />
          <div className="absolute w-[400px] h-[400px] bg-purple-500/20 blur-[120px] bottom-[-150px] right-[-150px]" />
        </>
      )}

      {/* 🔥 Navbar */}
      <div className="flex justify-between items-center px-10 py-6 relative z-10">
        <h1 className="text-xl font-semibold">SimplyNotes</h1>

        <div className="flex gap-3 items-center">
          {/* Theme Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`
              px-3 py-2 rounded-lg transition
              ${
                darkMode
                  ? "bg-white/10 hover:bg-white/20"
                  : "bg-white shadow border border-gray-200 hover:bg-gray-100"
              }
            `}
          >
            {darkMode ? "🌞" : "🌙"}
          </button>

          {/* Login */}
          <button
            onClick={() => navigate("/login")}
            className={`
              px-4 py-2 rounded-lg transition
              ${
                darkMode
                  ? "border border-white/10 hover:bg-white/10"
                  : "border border-gray-300 bg-white hover:bg-gray-100 shadow-sm"
              }
            `}
          >
            Login
          </button>

          {/* Get Started */}
          <button
            onClick={() => navigate("/signup")}
            className={`
              px-5 py-2 rounded-lg font-medium transition
              ${
                darkMode
                  ? "bg-white text-black hover:opacity-90"
                  : "bg-black text-white hover:bg-gray-900 shadow-md"
              }
            `}
          >
            Get Started
          </button>
        </div>
      </div>

      {/* 🚀 HERO */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="text-center mt-24 px-6 relative z-10"
      >
        <h1 className="text-5xl md:text-6xl font-bold leading-tight">
          Your Thoughts,
          <br />
          <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Organized Intelligently
          </span>
        </h1>

        <p className="mt-6 text-lg max-w-xl mx-auto opacity-80">
          A minimal workspace today — evolving into an AI-powered productivity
          system tomorrow.
        </p>

        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => navigate("/signup")}
            className={`
              px-6 py-3 rounded-xl font-medium transition
              ${
                darkMode
                  ? "bg-white text-black"
                  : "bg-black text-white shadow-md"
              }
            `}
          >
            Start Free
          </button>

          <button
            onClick={() => navigate("/login")}
            className={`
              px-6 py-3 rounded-xl transition
              ${
                darkMode
                  ? "border border-white/10 hover:bg-white/10"
                  : "border border-gray-300 bg-white hover:bg-gray-100 shadow-sm"
              }
            `}
          >
            Login
          </button>
        </div>
      </motion.div>

      {/* 💻 PRODUCT PREVIEW */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="mt-24 px-10"
      >
        <div
          className={`
          max-w-5xl mx-auto rounded-3xl p-6 transition
          ${
            darkMode
              ? "bg-white/5 border border-white/10 backdrop-blur-xl"
              : "bg-white border border-gray-200 shadow-xl"
          }
        `}
        >
          <div
            className={`
            rounded-xl p-6 h-[300px] relative overflow-hidden
            ${darkMode ? "bg-gray-900/60" : "bg-gray-50"}
          `}
          >
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ repeat: Infinity, duration: 5 }}
              className="absolute top-10 left-10 w-48 h-24 bg-blue-400/20 rounded-xl"
            />

            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ repeat: Infinity, duration: 6 }}
              className="absolute bottom-10 right-10 w-56 h-28 bg-purple-400/20 rounded-xl"
            />

            <p className="text-center mt-24 opacity-60">
              Live workspace preview
            </p>
          </div>
        </div>
      </motion.div>

      {/* 🧠 FEATURES */}
      <div className="mt-32 px-10">
        <h2 className="text-center text-2xl mb-12 font-semibold">
          Built for Focus
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {["Fast Writing", "Minimal UI", "Structured Notes"].map((f, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              whileHover={{ y: -6 }}
              className={`
                p-6 rounded-2xl transition
                ${
                  darkMode
                    ? "bg-white/5 border border-white/10"
                    : "bg-white border border-gray-200 shadow-md"
                }
              `}
            >
              <h3 className="text-lg font-medium mb-2">{f}</h3>
              <p className="text-sm opacity-70">
                Designed for clarity and focus.
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 🚀 COMING SOON */}
      <div className="mt-32 px-10">
        <h2 className="text-center text-2xl mb-12 font-semibold">
          Coming Soon
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {["AI Assistant", "Smart Search", "Collaboration"].map((f, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className={`
                p-6 rounded-2xl border transition
                ${
                  darkMode
                    ? "border-white/10 bg-gradient-to-br from-blue-500/10 to-purple-500/10"
                    : "border-gray-200 bg-white shadow-md"
                }
              `}
            >
              <h3 className="text-lg font-medium">{f}</h3>
              <p className="text-sm mt-2 opacity-70">
                Expanding your productivity.
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 🔥 CTA */}
      <div className="mt-32 mb-20 text-center">
        <h2 className="text-3xl mb-4 font-semibold">
          Start building your workspace
        </h2>

        <button
          onClick={() => navigate("/signup")}
          className={`
            px-8 py-3 rounded-xl transition
            ${
              darkMode
                ? "bg-white text-black"
                : "bg-black text-white shadow-md"
            }
          `}
        >
          Get Started
        </button>
      </div>
    </div>
  );
}

export default HomePage;