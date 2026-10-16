

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCamera,
  faArrowRight,
  faUser,
  faPen,
  faCommentDots,
} from "@fortawesome/free-solid-svg-icons";

const Profile = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Clean up the temporary image URL
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  // Select and preview photo
  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image.");
      e.target.value = "";
      return;
    }

  

    setError("");
    setPhoto(file);
    setPreview(URL.createObjectURL(file));
  };

  // Submit profile
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("bio", bio.trim());

      if (photo) {
        formData.append("photo", photo);
      }

      const response = await axios.put(
        "http://localhost:5000/api/user/update-profile",
        formData,
        { withCredentials: true }
      );

      if (response.data?.status === false) {
        setError(response.data.message || "Unable to save your profile.");
        return;
      }

      navigate("/chat");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not save your profile. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#09090f] px-4 py-6 text-white">

      {/* Background glow */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-teal-500/20 blur-[100px]" />

      <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-purple-600/20 blur-[100px]" />

      {/* Main layout */}
      <div className="relative grid w-full max-w-4xl grid-cols-1 items-center gap-5 md:grid-cols-2">

        {/* LEFT: Profile form */}
        <div className="w-full rounded-2xl border border-white/10 bg-[#111119]/95 p-5 shadow-2xl sm:p-7">

          {/* Logo */}
          <div className="mb-5 flex items-center justify-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-teal-400 to-purple-500 font-black text-black">
              C
            </div>

            <h1 className="text-xl font-bold">
              Chatox<span className="text-teal-400">Tech</span>
            </h1>
          </div>

          {/* Heading */}
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[2px] text-teal-400">
              One last step
            </p>

            <h2 className="mt-2 text-2xl font-bold">
              Complete your profile
            </h2>

            <p className="mt-2 text-sm text-gray-400">
              Add a photo and tell people a little about yourself.
            </p>
          </div>

          {/* Photo upload */}
          <div className="mt-5 flex justify-center">
            <label
              htmlFor="profile-photo"
              className="group relative flex h-20 w-20 cursor-pointer items-center justify-center rounded-full border-2 border-dashed border-purple-500/60 bg-[#191923] transition hover:border-teal-400"
            >
              {preview ? (
                <img
                  src={preview}
                  alt="Profile preview"
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center gap-1 text-gray-400">
                  <FontAwesomeIcon
                    icon={faCamera}
                    className="text-xl group-hover:text-teal-400"
                  />
                  <span className="text-[10px]">Add photo</span>
                </div>
              )}

              <span className="absolute bottom-0 right-0 flex h-6 w-6 items-center justify-center rounded-full border-2 border-[#111119] bg-teal-400 text-black">
                <FontAwesomeIcon icon={faCamera} className="text-[10px]" />
              </span>
            </label>

            <input
              id="profile-photo"
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
            />
          </div>

          <p className="mt-2 text-center text-xs text-gray-500">
            Profile picture (optional)
          </p>

          {/* Error message */}
          {error && (
            <div className="mt-4 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">

            {/* Name */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-200">
                Your name
              </label>

              <div className="relative">
                <FontAwesomeIcon
                  icon={faUser}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-teal-400"
                />

                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  maxLength={50}
                  required
                  className="w-full rounded-xl border border-purple-900/50 bg-[#191923] py-3 pl-10 pr-4 text-sm outline-none transition placeholder:text-gray-500 focus:border-teal-400"
                />
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-200">
                About you
                <span className="ml-2 font-normal text-gray-500">
                  (optional)
                </span>
              </label>

              <div className="relative">
                <FontAwesomeIcon
                  icon={faPen}
                  className="absolute left-3 top-4 text-sm text-purple-400"
                />

                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Hey there! I'm using ChatoxTech..."
                  rows={2}
                  maxLength={160}
                  className="w-full resize-none rounded-xl border border-purple-900/50 bg-[#191923] py-3 pl-10 pr-4 text-sm outline-none transition placeholder:text-gray-500 focus:border-teal-400"
                />
              </div>

              <p className="mt-1 text-right text-xs text-gray-500">
                {bio.length}/160
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-400 to-purple-500 py-3 text-sm font-bold text-black transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Saving profile..." : "Save & Continue"}

              {!loading && (
                <FontAwesomeIcon icon={faArrowRight} />
              )}
            </button>
          </form>

          <p className="mt-4 text-center text-xs text-gray-500">
            Your profile helps friends recognize you.
          </p>
        </div>

        {/* RIGHT: Decorative panel */}
        <div className="hidden min-h-[430px] flex-col items-center justify-center rounded-2xl border border-purple-500/20 bg-gradient-to-br from-[#151522] to-[#20152f] p-8 text-center md:flex">

          <div className="flex h-24 w-24 items-center justify-center rounded-3xl border border-teal-400/20 bg-teal-400/10 shadow-lg shadow-teal-500/10">
            <FontAwesomeIcon
              icon={faCommentDots}
              className="text-5xl text-teal-300"
            />
          </div>

          <h2 className="mt-7 text-2xl font-bold">
            Make it <span className="text-teal-400">personal.</span>
          </h2>

          <p className="mt-3 max-w-xs text-sm leading-6 text-gray-400">
            Add your photo and a short bio so your friends can recognize you
            and get to know you better.
          </p>

          <div className="mt-6 flex items-center gap-2 text-sm text-purple-300">
            <span className="h-2 w-2 rounded-full bg-teal-400" />
            Your conversations start here
          </div>

          <div className="mt-8 flex -space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#20152f] bg-teal-400/20 text-sm text-teal-300">
              C
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#20152f] bg-purple-400/20 text-sm text-purple-300">
              T
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#20152f] bg-white/10 text-sm text-gray-300">
              +
            </div>
          </div>

          <p className="mt-3 text-xs text-gray-500">
            Connect. Chat. Stay in touch.
          </p>
        </div>

      </div>
    </div>
  );
};

export default Profile;