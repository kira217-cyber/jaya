// src/components/login/Login.jsx
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
// import { AuthContext } from "@/context/AuthContext";
import toast from "react-hot-toast";

import bannerImg from "../../../assets/login_page_image.png";
import logo from "../../../assets/22221.png";

import { FaEye, FaEyeSlash } from "react-icons/fa";
import { AuthContext } from "@/Context/AuthContext";

const Login = ({ onClose, onRegisterClick }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!username || !password) {
      setError("Username and password are required");
      toast.error("Username and password are required");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("userId", data.user.id);
      localStorage.setItem("user", JSON.stringify(data.user));

      setUser(data.user);
      toast.success(`Welcome, ${data.user.username}!`);

      onClose();
      navigate("/");

      // Force reload so authenticated state reflects immediately across the app
      setTimeout(() => {
        window.location.reload();
      }, 200);
    } catch (err) {
      const errorMsg = err.message || "Login failed";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="relative w-[95%] max-w-[900px] h-[600px] rounded-2xl overflow-hidden shadow-2xl bg-[#053a40] flex">
        {/* ❌ Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-yellow-400 text-black font-bold hover:bg-yellow-300"
        >
          ✕
        </button>

        {/* LEFT BANNER */}
        <div className="hidden md:block w-1/2 relative">
          <img
            src={bannerImg}
            alt="banner"
            className="w-full h-full"
          />

         
        </div>

        {/* RIGHT FORM */}
        <div className="w-full md:w-1/2 p-8 text-white flex flex-col justify-center">
          {/* Header */}
          <h2 className="text-3xl font-bold text-yellow-400 mb-2">Login</h2>
          <p className="text-sm mb-6">
            No account yet?{" "}
            <span
              onClick={() => {
                onClose();
                onRegisterClick();
              }}
              className="text-teal-300 cursor-pointer hover:underline"
            >
              Register
            </span>
          </p>

          <img src={logo} alt="logo" className="w-20 mx-auto mb-4" />

          {/* Error */}
          {error && (
            <div className="mb-4 text-sm bg-red-500/20 text-red-300 p-2 rounded text-center">
              {error}
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <input
              type="text"
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-3 rounded-lg bg-[#0b2f34] border border-[#1aa6a6] focus:outline-none focus:ring-2 focus:ring-teal-400"
            />

            {/* Password */}
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-3 rounded-lg bg-[#0b2f34] border border-[#1aa6a6] focus:outline-none focus:ring-2 focus:ring-teal-400 pr-12"
              />
              <span
                onClick={() => setShowPass(!showPass)}
                className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-teal-300"
              >
                {showPass ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            {/* Remember / Forgot */}
            <div className="flex justify-between items-center text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                Remember
              </label>
              <span className="text-yellow-400 cursor-pointer hover:underline">
                Forgot Password
              </span>
            </div>

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg font-bold transition ${
                loading
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-yellow-400 text-yellow-800 hover:bg-yellow-300"
              }`}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Social */}
          <div className="mt-6">
            <p className="text-center text-sm mb-3">or connect with</p>
            <div className="flex gap-4">
              <button className="flex-1 py-2 rounded bg-red-600 hover:bg-red-500">
                Google
              </button>
              <button className="flex-1 py-2 rounded bg-blue-600 hover:bg-blue-500">
                Facebook
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
