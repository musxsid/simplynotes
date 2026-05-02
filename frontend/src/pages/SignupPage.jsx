import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../services/notesService";
import toast from "react-hot-toast";

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

      toast.success("Account created successfully");

      navigate("/"); // go to login
    } catch (err) {
      toast.error("Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">

      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg w-80">

        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800 dark:text-white">
          Signup
        </h2>

        {/* Username */}
        <input
          type="text"
          placeholder="Username"
          className="w-full mb-3 p-2 border rounded-lg 
          bg-white dark:bg-gray-700 
          text-gray-800 dark:text-white 
          border-gray-300 dark:border-gray-600"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-2 border rounded-lg 
          bg-white dark:bg-gray-700 
          text-gray-800 dark:text-white 
          border-gray-300 dark:border-gray-600"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Button */}
        <button
          onClick={handleSignup}
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition active:scale-95 disabled:opacity-50"
        >
          {loading ? "Creating..." : "Signup"}
        </button>

        {/* Login link */}
        <p className="text-sm mt-4 text-center text-gray-600 dark:text-gray-300">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/")}
            className="text-blue-500 cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>

      </div>
    </div>
  );
}

export default SignupPage;