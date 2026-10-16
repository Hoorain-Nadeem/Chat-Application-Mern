import {
  faEllipsisVertical,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";

export default function Sidebar() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const {
    getUsers,
    selectedUser,
    setSelectedUser,
    users,
    unSeenMessages,
    setUnseenMessages,
  } = useContext(ChatContext);
  const filteredUsers = search
    ? users.filter((user) =>
        user.name.toLowerCase().includes(search.toLocaleLowerCase()),
      )
    : users;
  const { onlineUsers, logout } = useContext(AuthContext);

  useEffect(() => {
    getUsers();
  }, [onlineUsers]);

  return (
 
    
<aside className="flex h-full min-h-0 w-full shrink-0 flex-col overflow-hidden border-r border-purple-400/15 bg-[#09090f]/85 px-3 backdrop-blur-xl">

  {/* Header */}
  <div className="border-b border-white/10 px-3 py-5 text-white">
    <div className="flex items-center justify-between gap-2">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Chatox<span className="text-teal-400">Tech</span>
        </h1>
        <p className="mt-1 text-xs text-gray-400">
          Stay connected, always.
        </p>
      </div>

      <div className="group relative py-2">
        <button
          type="button"
          aria-label="More options"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-gray-300 transition hover:border-teal-400/30 hover:bg-teal-400/10 hover:text-teal-300"
        >
          <FontAwesomeIcon icon={faEllipsisVertical} />
        </button>

        <div className="absolute right-0 top-full z-30 hidden w-40 overflow-hidden rounded-xl border border-white/10 bg-[#111119] p-1.5 shadow-xl shadow-black/40 group-hover:block group-focus-within:block">
        

         

          <button
            type="button"
            onClick={async () => {
              await logout();
              navigate("/login", { replace: true });
            }}
            className="w-full rounded-lg px-3 py-2.5 text-left text-sm text-red-300 transition hover:bg-red-500/10"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  </div>

  {/* Search */}
  <div className="mt-4 flex items-center gap-3 rounded-xl border border-white/10 bg-[#111119]/90 px-4 py-3 transition focus-within:border-teal-400/50 focus-within:ring-2 focus-within:ring-teal-400/10">
    <FontAwesomeIcon
      icon={faMagnifyingGlass}
      className="text-sm text-teal-400"
    />

    <input
      type="text"
      placeholder="Search people..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-gray-500"
    />

    {search && (
      <button
        type="button"
        onClick={() => setSearch("")}
        className="text-xs text-gray-400 hover:text-teal-300"
      >
        Clear
      </button>
    )}
  </div>

  {/* Chat List */}
  <div className="mt-5 min-h-0 flex-1 overflow-y-auto">
    <div className="mb-3 flex items-center justify-between px-2">
      <h3 className="text-xs font-semibold uppercase tracking-[1.5px] text-gray-400">
        Recent Chats
      </h3>


    </div>

    {filteredUsers.length > 0 ? (
      filteredUsers.map((user) => {
        const isSelected = selectedUser?._id === user._id;
        const isOnline = onlineUsers.includes(user._id);
        const unseenCount = unSeenMessages?.[user._id] ?? 0;

        return (
          <button
            key={user._id}
            type="button"
            onClick={() => {
              setSelectedUser(user);
              setUnseenMessages((prev) => ({
                ...prev,
                [user._id]: 0,
              }));
            }}
            className={`mb-1 flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left transition duration-200 ${
              isSelected
                ? "border-teal-400/25 bg-gradient-to-r from-teal-400/10 to-purple-500/10 shadow-md shadow-black/10"
                : "border-transparent hover:border-white/5 hover:bg-white/[0.04]"
            }`}
          >
            {/* Avatar */}
            <div className="relative h-12 w-12 shrink-0">
              {user.photo ? (
                <img
                  src={`data:${user.mimetype || "image/jpeg"};base64,${user.photo}`}
                  alt={user.name || "User"}
                  className="h-12 w-12 rounded-full border border-white/10 object-cover"
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-purple-400/20 bg-gradient-to-br from-blue-950 to-purple-900 text-lg font-bold text-teal-200">
                  {user.name?.charAt(0).toUpperCase() || "?"}
                </div>
              )}

              <span
                className={`absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-[#09090f] ${
                  isOnline ? "bg-teal-400" : "bg-gray-600"
                }`}
              />
            </div>

            {/* User Details */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <h4
                  className={`truncate text-sm font-semibold ${
                    isSelected ? "text-teal-200" : "text-gray-100"
                  }`}
                >
                  {user.name || "Unknown User"}
                </h4>
              </div>

              <div className="mt-1 flex items-center justify-between gap-2">
                <p
                  className={`truncate text-xs ${
                    isOnline ? "text-teal-400" : "text-gray-500"
                  }`}
                >
                  {isOnline ? "Online" : "Offline"}
                </p>

                {unseenCount > 0 && (
                  <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-teal-400 to-purple-500 px-1.5 text-[10px] font-bold text-[#09090f]">
                    {unseenCount > 99 ? "99+" : unseenCount}
                  </span>
                )}
              </div>
            </div>
          </button>
        );
      })
    ) : (
      <div className="px-4 py-12 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-purple-400/15 bg-purple-500/10">
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className="text-purple-300"
          />
        </div>

        <p className="text-sm font-medium text-gray-300">
          No users found
        </p>
        <p className="mt-1 text-xs text-gray-500">
          Try searching with another name.
        </p>
      </div>
    )}
  </div>

  {/* Footer */}
  <div className="border-t border-white/10 px-3 py-3">
    <p className="text-center text-[10px] tracking-wide text-gray-500">
      ChatoxTech · Real-time messaging
    </p>
  </div>
</aside>
  );
}
