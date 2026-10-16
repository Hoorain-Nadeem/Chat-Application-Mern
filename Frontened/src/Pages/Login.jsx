import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function Login({ selectedUser, setSelectedUser }) {
  const navigate = useNavigate();
const {login}=useContext(AuthContext)
  const [formData, setFormData] = useState({
    email: "",
   password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

 
const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setSuccess("");

  if (!formData.email || !formData.password) {
    setError("Please fill in all fields.");
    return;
  }

  try {
    setLoading(true);
   console.log(formData)
     let success = await login(formData.email,formData.password);

    if (success) {
      setSuccess("Login successful!");
      navigate("/chat",{replace:true});
    }
  } catch (error) {
    setError(error.message || "Login failed.");
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="min-h-screen w-full bg-[#09090f] text-white flex items-center justify-center px-4 py-6 sm:px-6 relative overflow-hidden">

      {/* Background glow */}
      <div className="absolute -top-28 -left-24 w-72 h-72 bg-teal-500/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-28 -right-20 w-80 h-80 bg-purple-600/20 rounded-full blur-[110px] pointer-events-none" />

      {/* Main card */}
      <div className="relative w-full max-w-4xl grid md:grid-cols-2 rounded-2xl border border-white/10 bg-[#111119]/90 shadow-2xl overflow-hidden">

        {/* Left panel */}
        <div className="hidden md:flex flex-col justify-between p-7 lg:p-9 bg-gradient-to-br from-teal-950/70 via-[#171321] to-purple-950/70 border-r border-white/10">

          <div>
            <Link to="/" className="flex items-center gap-3 w-fit">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-purple-500 flex items-center justify-center text-black font-black text-xl">
                C
              </div>

              <div>
                <h1 className="text-xl font-bold tracking-tight">
                  Chatox<span className="text-teal-400">Tech</span>
                </h1>
                <p className="text-[9px] uppercase tracking-[2px] text-gray-400">
                  Real-time chat application
                </p>
              </div>
            </Link>

            <div className="mt-12">
              <p className="text-teal-400 text-xs font-semibold uppercase tracking-[2px]">
                Welcome to Chatox
              </p>

              <h2 className="text-3xl font-bold leading-tight mt-3">
                Conversations that
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-purple-400">
                  bring us closer.
                </span>
              </h2>

              <p className="text-gray-400 text-sm leading-6 mt-4 max-w-xs">
                Create your account and connect with people through a simple,
                modern messaging experience.
              </p>
            </div>
          </div>

          <div className="space-y-4 mt-10">
            {[
              "Connect with people easily",
              "Enjoy a clean chat experience",
              "Keep conversations in one place",
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-3">
                <span className="w-6 h-6 shrink-0 rounded-full bg-teal-400/10 border border-teal-400/20 text-teal-300 flex items-center justify-center text-xs">
                  ✓
                </span>
                <span className="text-gray-300 text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right panel */}
        <div className="p-6 sm:p-8 lg:p-9">

          {/* Mobile logo */}
          <div className="md:hidden mb-7">
            <Link to="/" className="flex items-center gap-3 w-fit">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-teal-400 to-purple-500 flex items-center justify-center text-black font-black">
                C
              </div>

              <h1 className="text-xl font-bold">
                Chatox<span className="text-teal-400">Tech</span>
              </h1>
            </Link>
          </div>

          {/* Heading */}
          <div>
            <p className="text-teal-400 text-xs font-semibold uppercase tracking-[2px]">
              Get Started
            </p>

            <h2 className="text-2xl font-bold mt-2">
              Create your account
            </h2>

            <p className="text-gray-400 text-sm mt-2">
              Join the conversation and get connected.
            </p>
          </div>

          {/* Messages */}
          {error && (
            <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mt-4 p-3 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-300 text-sm">
              {success}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
<div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Email Address
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                autoComplete="email"
                required
                className="w-full px-4 py-3 rounded-lg bg-[#191923] border border-white/10 text-white text-sm placeholder:text-gray-500 outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-400/10"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Password
              </label>

              <input
                type="text"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                
                required
                className="w-full px-4 py-3 rounded-lg bg-[#191923] border border-white/10 text-white text-sm placeholder:text-gray-500 outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-400/10"
              />
            </div>

            


            {/* Terms */}
            <label className="flex items-start gap-3 text-xs sm:text-sm text-gray-400 cursor-pointer">
              <input
                type="checkbox"
                required
                className="mt-0.5 accent-teal-400 shrink-0"
              />
              <span>
                I agree to the{" "}
                <span className="text-teal-400">Terms of Service</span>
                {" "}and{" "}
                <span className="text-purple-400">Privacy Policy</span>.
              </span>
            </label>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-teal-400 to-purple-500 text-[#09090f] font-bold text-sm hover:brightness-110 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 shadow-lg shadow-teal-500/10"
            >
              {loading ? "Login Account..." : "Login Account →"}
            </button>
          </form>

          {/* Login */}
          <p className="text-center mt-6 text-sm text-gray-400">
            Dont't have an account?{" "}
            <Link
              to="/signup"
              className="text-teal-400 font-semibold hover:text-teal-300 transition"
            >
              Create Account
            </Link>
          </p>

          <div className="text-center mt-4">
            <Link
              to="/"
              className="text-xs text-gray-500 hover:text-purple-300 transition"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
