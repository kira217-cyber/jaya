// src/components/login/RegistrationModal.jsx
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import toast from "react-hot-toast";

import bannerImg from "../../../assets/login_page_image.png";
import logo from "../../../assets/22221.png";

import { FaFacebookF, FaGoogle } from "react-icons/fa";
import { AuthContext } from "@/Context/AuthContext";

const RegistrationModal = ({ onClose, openLogin, initialReferral }) => {
  const [username, setUsername] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);

  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (initialReferral) {
      setReferralCode(initialReferral);
    }
  }, [initialReferral]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!username || !whatsapp || !password || !confirmPassword) {
      toast.error("All fields are required");
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      setLoading(false);
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      setLoading(false);
      return;
    }
    if (!agree) {
      toast.error("You must agree to the terms and conditions");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/main/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username,
            email: `${username}@temp.com`,
            whatsapp,
            password,
            referral: referralCode || undefined,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("userId", data.user.id);
      setUser(data.user);

      toast.success(`Welcome ${data.user.username}`);
      onClose();

      data.user.role === "user" ? navigate("/") : navigate("/pending-approval");
    } catch (err) {
      toast.error(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="relative w-[95%] max-w-[900px] h-auto md:h-[850px] rounded-2xl overflow-hidden shadow-2xl bg-[#053a40] flex flex-col md:flex-row">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-yellow-400 text-black font-bold hover:bg-yellow-300"
        >
          ✕
        </button>

        {/* LEFT BANNER */}
        <div className="hidden md:block w-1/2 relative">
          <img src={bannerImg} alt="banner" className="w-full h-full object-cover" />
        </div>

        {/* RIGHT FORM */}
        <div className="w-full md:w-1/2 p-8 text-white flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-yellow-400 mb-2">Register</h2>
          <p className="text-sm mb-6">
            Already have an account?{" "}
            <span
              onClick={() => {
                onClose();
                openLogin();
              }}
              className="text-teal-300 cursor-pointer hover:underline"
            >
              Login
            </span>
          </p>

          <img src={logo} alt="logo" className="w-20 mx-auto mb-4" />

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Phone */}
            <input
              type="text"
              placeholder="Phone number"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-3 rounded-lg bg-[#0b2f34] border border-[#1aa6a6] focus:outline-none focus:ring-2 focus:ring-teal-400"
            />

            {/* Username */}
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-3 rounded-lg bg-[#0b2f34] border border-[#1aa6a6] focus:outline-none focus:ring-2 focus:ring-teal-400"
            />

            {/* Password */}
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-3 rounded-lg bg-[#0b2f34] border border-[#1aa6a6] focus:outline-none focus:ring-2 focus:ring-teal-400"
            />

            {/* Confirm Password */}
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-3 rounded-lg bg-[#0b2f34] border border-[#1aa6a6] focus:outline-none focus:ring-2 focus:ring-teal-400"
            />

            {/* Referral */}
            <input
              type="text"
              placeholder="Referral code (optional)"
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value)}
              readOnly={!!initialReferral}
              disabled={loading}
              className="w-full px-4 py-3 rounded-lg bg-[#0b2f34] border border-[#1aa6a6] focus:outline-none focus:ring-2 focus:ring-teal-400"
            />

            {/* Agree */}
            <label className="flex items-center gap-2 text-sm mt-2">
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="accent-yellow-400"
              />
              I am 18 years old and agree to Terms of Use
            </label>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg font-bold transition ${
                loading
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-yellow-400 text-yellow-800 hover:bg-yellow-300"
              }`}
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>

          {/* Social */}
          <div className="mt-6">
            <p className="text-center text-sm mb-3">or connect with</p>
            <div className="flex gap-4">
              <button className="flex-1 py-2 rounded bg-red-600 hover:bg-red-500 flex items-center justify-center gap-2">
                <FaGoogle /> Google
              </button>
              <button className="flex-1 py-2 rounded bg-blue-600 hover:bg-blue-500 flex items-center justify-center gap-2">
                <FaFacebookF /> Facebook
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationModal;
