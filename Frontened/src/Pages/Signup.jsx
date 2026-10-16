import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
export default function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    bio: "",
    photo: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState("");
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5 MB.");
      return;
    }

    setError("");
    setPhoto(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.password) {
      Swal.fire({
        icon: "error",
        title: "All Fields are required",

        confirmButtonColor: "#14b8a6",
        background: "#111119",
        color: "#ffffff",
      });
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);
      const data = new FormData();
      data.append("name", formData.name.trim());
      data.append("email", formData.email.trim());
      data.append("password", formData.password);
      data.append("bio", formData.bio.trim());

      if (photo) {
        data.append("photo", photo);
      }
      const response = await axios.post(
        "http://localhost:5000/api/user/register",

        data,
      );

      Swal.fire({
        title: "Account created successfully!!",
        icon: "success",
        draggable: true,
      });

      setFormData({
        name: "",
        email: "",
        password: "",
        bio: "",
        photo: null,
      });

      navigate("/login");
    } catch (error) {
      const message =
        error.response?.data?.message ||
        (error.response
          ? "Registration failed. Please try again."
          : "Unable to connect to the server.");

      setError(message);
      await Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: message,
        confirmButtonColor: "#14b8a6",
        background: "#111119",
        color: "#ffffff",
      });
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

            <h2 className="text-2xl font-bold mt-2">Create your account</h2>

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
                Full Name
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                autoComplete="name"
                required
                className="w-full px-4 py-3 rounded-lg bg-[#191923] border border-white/10 text-white text-sm placeholder:text-gray-500 outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-400/10"
              />
            </div>

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
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                autoComplete="new-password"
                minLength={6}
                required
                className="w-full px-4 py-3 rounded-lg bg-[#191923] border border-white/10 text-white text-sm placeholder:text-gray-500 outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-400/10"
              />

              <p className="text-xs text-gray-500 mt-2">
                Use at least 6 characters.
              </p>
            </div>

            {/* Profile Picture */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Profile Picture{" "}
                <span className="text-gray-500">(Optional)</span>
              </label>

              <div className="flex items-center gap-4 rounded-lg border border-white/10 bg-[#191923] p-4">
                <div className="w-16 h-16 rounded-full overflow-hidden shrink-0 border-2 border-teal-400/50 bg-[#252532] flex items-center justify-center">
                  {preview ? (
                    <img
                      src={preview}
                      alt="Profile preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl text-gray-400">
                      {formData.name.charAt(0).toUpperCase() || "?"}
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="block w-full text-xs text-gray-400
          file:mr-3 file:rounded-md file:border-0
          file:bg-teal-400/10 file:px-3 file:py-2
          file:text-teal-300 file:font-semibold
          hover:file:bg-teal-400/20"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    PNG, JPG or other image format · Max 5 MB
                  </p>
                </div>
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                About You <span className="text-gray-500">(Optional)</span>
              </label>

              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell people a little about yourself..."
                rows={3}
                maxLength={250}
                className="w-full px-4 py-3 rounded-lg bg-[#191923]
      border border-white/10 text-white text-sm
      placeholder:text-gray-500 outline-none resize-none
      transition focus:border-teal-400
      focus:ring-2 focus:ring-teal-400/10"
              />

              <p className="text-xs text-gray-500 text-right mt-1">
                {formData.bio.length}/250 characters
              </p>
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
                <span className="text-teal-400">Terms of Service</span> and{" "}
                <span className="text-purple-400">Privacy Policy</span>.
              </span>
            </label>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-teal-400 to-purple-500 text-[#09090f] font-bold text-sm hover:brightness-110 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 shadow-lg shadow-teal-500/10"
            >
              {loading ? "Creating Account..." : "Create Account →"}
            </button>
          </form>

          {/* Login */}
          <p className="text-center mt-6 text-sm text-gray-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-teal-400 font-semibold hover:text-teal-300 transition"
            >
              Login
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
