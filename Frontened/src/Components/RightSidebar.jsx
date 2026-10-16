import React, { useContext, useEffect, useState } from "react";

import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import {
  faCircleInfo,
  faImage,
  faImages,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const RightSidebar = () => {
  const { selectedUser, messages } = useContext(ChatContext);
  const { onlineUsers } = useContext(AuthContext);
  const [msgImg, setMsgImg] = useState([]);
  useEffect(() => {
    const imageMessages = (messages || []).filter(
      (msg) => msg.image && msg.image.trim() !== "",
    );

    setMsgImg(imageMessages);
  }, [messages]);


  return selectedUser &&(
    <aside className="flex h-full w-full flex-col overflow-y-auto border-l border-white/10 bg-[#09090f]/90 text-white backdrop-blur-xl">
      {/* Profile Header */}
    
      <div className="relative isolate shrink-0 overflow-hidden border-b border-white/10 px-4 pb-6 pt-8">
        {/* Background glow */}
        <div className="pointer-events-none absolute -right-12 -top-16 h-36 w-36 rounded-full bg-purple-600/20 blur-3xl" />
        <div className="pointer-events-none absolute -left-12 top-20 h-32 w-32 rounded-full bg-teal-500/10 blur-3xl" />

        <div className="relative flex flex-col items-center text-center">
          {/* Profile Image */}
          <div className="relative">
            <div className="rounded-full bg-gradient-to-br from-teal-400 via-cyan-500 to-purple-600 p-[2px] shadow-lg shadow-purple-500/20">
              <img
                src={
                  selectedUser?.photo
                    ? `
              
            data:${selectedUser?.mimetype};base64,${selectedUser?.photo}`
                    : "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/ac/Default_pfp.jpg/250px-Default_pfp.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=thumbnail"
                }
                alt={selectedUser.name || "User profile"}
                className="h-24 w-24 rounded-full border-4 border-[#09090f] object-cover"
              />
            </div>

            {/* Online Status */}
            <span
              className={`absolute bottom-1 right-1 h-4 w-4 rounded-full border-[3px] border-[#09090f] ${
                onlineUsers.includes(selectedUser._id)   ? "bg-teal-400" : "bg-gray-500"
              }`}
            />
          </div>

          <h3 className="mt-4 text-xl font-semibold tracking-wide">
            {selectedUser.name || "Unknown User"}
          </h3>

          <div
            className={`mt-2 flex items-center gap-2 rounded-full border px-3 py-1 text-xs ${
              onlineUsers.includes(selectedUser._id) 
                ? "border-teal-400/20 bg-teal-400/10 text-teal-300"
                : "border-white/10 bg-white/5 text-gray-400"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                onlineUsers.includes(selectedUser._id)  ? "bg-teal-400" : "bg-gray-500"
              }`}
            />
            {onlineUsers.includes(selectedUser._id) ? "Active now" : "Offline"}
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="border-b border-white/10 px-4 py-5">
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-300">
            <FontAwesomeIcon icon={faCircleInfo} />
          </div>

          <h4 className="text-sm font-semibold tracking-wide text-gray-100">
            About
          </h4>
        </div>

        <div className="rounded-xl border border-white/[0.07] bg-[#111119]/80 p-3">
          <p className="break-words text-sm leading-6 text-gray-400">
            {selectedUser.bio?.trim() || "This user hasn't added a bio yet."}
          </p>
        </div>
      </div>

      {/* Shared Media Section */}
      <div className="flex-1 px-4 py-5">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-400/10 text-teal-300">
              <FontAwesomeIcon icon={faImages} />
            </div>

            <h4 className="text-sm font-semibold tracking-wide text-gray-100">
              Shared Media
            </h4>
          </div>

          <span className="rounded-full border border-purple-400/20 bg-purple-500/10 px-2.5 py-1 text-xs font-medium text-purple-300">
            {msgImg.length}
          </span>
        </div>

        {msgImg.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {msgImg.map((pic, index) => (
              <a
                key={pic._id || `${pic.image.slice(0, 20)}-${index}`}
                href={`data:${pic.mimetype || "image/jpeg"};base64,${pic.image}`}
                target="_blank"
                rel="noreferrer"
                title={pic.originalName || "View shared image"}
                className="group relative aspect-square overflow-hidden rounded-xl border border-white/10 bg-[#171321] transition duration-300 hover:border-teal-400/50 hover:shadow-lg hover:shadow-teal-500/10"
              >
                <img
                  src={`data:${pic.mimetype || "image/jpeg"};base64,${pic.image}`}
                  alt={pic.originalName || "Shared image"}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-110"
                />

                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition duration-300 group-hover:opacity-100">
                  <FontAwesomeIcon
                    icon={faImage}
                    className="text-xl text-white"
                  />
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center rounded-xl border border-dashed border-white/10 bg-[#111119]/60 px-4 py-8 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-400/10 to-purple-500/10 text-gray-500">
              <FontAwesomeIcon icon={faImages} className="text-xl" />
            </div>

            <p className="text-sm font-medium text-gray-300">No media yet</p>

            <p className="mt-1 text-xs leading-5 text-gray-500">
              Images shared in this conversation will appear here.
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-white/10 px-4 py-4 text-center">
        <p className="text-xs font-medium tracking-wider text-gray-500">
          <span className="bg-gradient-to-r from-teal-300 to-purple-400 bg-clip-text text-transparent">
            ChatoxTech
          </span>{" "}
          · Private conversations
        </p>
      </div>
    </aside>
  );
};

export default RightSidebar;
