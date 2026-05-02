import { useState } from "react";
import axios from "axios";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

 const handleLogin = async () => {
  try {
    const res = await axios.post("http://localhost:8080/api/auth/login", {
      username,
      password,
    });

    // 🔥 SAVE TOKEN
    localStorage.setItem("token", res.data.token);

    // 🔥 REDIRECT
    window.location.href = "/dashboard";

  } catch (err) {
    console.error(err);
    alert("Login Failed");
  }
};

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      
      <div className="bg-white p-8 rounded-2xl shadow-lg w-80">
        
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Login
        </h2>

        <input
          type="text"
          placeholder="Username"
          className="w-full mb-4 p-2 border rounded-lg"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-6 p-2 border rounded-lg"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-black text-white py-2 rounded-lg hover:opacity-80"
        >
          Login
        </button>

      </div>
    </div>
  );
}

export default LoginPage;