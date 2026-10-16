import {
  faCommentDots,
  faPaperPlane,
  faPlane,
  faPlaneUp,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useRef, useState } from "react";
import { useEffect } from "react";

import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";

const ChatContainer = ({}) => {
  const [input, setInput] = useState("");

  const [image, setImage] = useState(null);
  const { messages, selectedUser, setSelectedUser, sendMessage, getMessages } =
    useContext(ChatContext);
  const { authUser, onlineUsers } = useContext(AuthContext);
  let scrollEnd = useRef()
  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!input.trim() && !image) return;

    const formData = new FormData();

    formData.append("text", input.trim());

    if (image) {
      formData.append("image", image);
    }
    await sendMessage(formData);
    setInput("");
    setImage(null);
  };
  useEffect(() => {
    getMessages(selectedUser._id);
  }, [selectedUser]);

  useEffect(()=>{
    if(scrollEnd.current && messages){
      scrollEnd.current.scrollIntoView({behavior:"smooth"})
    }
  },[messages])
 
return selectedUser ? (
  <div className="flex h-full min-h-0 w-full flex-col overflow-hidden border-r border-white/10 bg-[#09090f]/65 text-white backdrop-blur-sm">

    {/* Header */}
    <header className="flex items-center justify-between border-b border-white/10 bg-[#111119]/80 px-3 py-3 backdrop-blur-xl sm:px-5">
      <div className="flex min-w-0 items-center gap-3">
        {/* User Avatar */}
        <div className="relative h-11 w-11 shrink-0">
          <img
            src={
              selectedUser?.photo
                ? `data:${selectedUser?.mimetype || "image/jpeg"};base64,${selectedUser.photo}`
                : "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/ac/Default_pfp.jpg/250px-Default_pfp.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=thumbnail"
            }
            alt={selectedUser?.name || "User"}
            className="h-11 w-11 rounded-full border border-purple-400/30 object-cover"
          />

          <span
            className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#111119] ${
              onlineUsers.includes(selectedUser._id)
                ? "bg-teal-400"
                : "bg-gray-600"
            }`}
          />
        </div>

        {/* User Details */}
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-white sm:text-base">
            {selectedUser.name}
          </h3>

          <p className="mt-1 flex items-center gap-1.5 text-xs">
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                onlineUsers.includes(selectedUser._id)
                  ? "bg-teal-400"
                  : "bg-gray-500"
              }`}
            />
            <span
              className={
                onlineUsers.includes(selectedUser._id)
                  ? "text-teal-300"
                  : "text-gray-400"
              }
            >
              {onlineUsers.includes(selectedUser._id)
                ? "Online"
                : "Offline"}
            </span>
          </p>
        </div>
      </div>

      {/* Header Action */}
      <button
        type="button"
        aria-label="More options"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-xl text-gray-300 transition hover:border-teal-400/30 hover:bg-teal-400/10 hover:text-teal-300"
      >
        ⋮
      </button>
    </header>

    {/* Chat Messages */}
    <main className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto bg-[radial-gradient(ellipse_at_top_right,rgba(126,34,206,0.12),transparent_45%),radial-gradient(ellipse_at_bottom_left,rgba(20,184,166,0.06),transparent_45%)] px-3 py-5 sm:px-5">

      {/* Date Divider */}
      <div className="flex justify-center">
        <span className="rounded-full border border-white/10 bg-[#111119]/80 px-4 py-1.5 text-[11px] font-medium tracking-wide text-gray-400">
          Today
        </span>
      </div>

      {messages?.map((message) => {
        const isSent = message.senderId === authUser?._id;

        return (
          <div
            key={message._id}
            className={`flex w-full ${
              isSent ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[85%] overflow-hidden rounded-2xl px-3 py-2.5 text-sm shadow-lg sm:max-w-[75%] ${
                isSent
                  ? "rounded-br-sm border border-teal-300/10 bg-gradient-to-br from-teal-500 to-purple-600 text-white shadow-purple-950/20"
                  : "rounded-bl-sm border border-white/10 bg-[#171321]/95 text-gray-100 shadow-black/20"
              }`}
            >
              {/* Shared Image */}
              {message.image && (
                <img
                  src={`data:${message.mimetype || "image/jpeg"};base64,${message.image}`}
                  alt={message.originalName || "Shared image"}
                  className="mb-2 max-h-64 max-w-full rounded-xl object-contain"
                />
              )}

              {/* Message Text */}
              {message.message && (
                <p className="whitespace-pre-wrap break-words leading-relaxed">
                  {message.message}
                </p>
              )}

              {/* Timestamp */}
              {message.createdAt && (
                <p
                  className={`mt-1 text-right text-[10px] ${
                    isSent ? "text-white/70" : "text-gray-500"
                  }`}
                >
                  {new Date(message.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              )}
            </div>
          </div>
        );
      })}

      <div ref={scrollEnd} />
    </main>

    {/* Message Input */}
    <form
      onSubmit={handleSendMessage}
      className="border-t border-white/10 bg-[#111119]/90 p-3 backdrop-blur-xl sm:px-4 sm:py-3"
    >
      <div className="flex items-center gap-2 sm:gap-3">

        {/* Image Attachment */}
        <label
          htmlFor="chat-file"
          title="Attach an image"
          className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-purple-400/15 bg-purple-500/10 text-xl text-purple-300 transition hover:border-teal-400/30 hover:bg-teal-400/10 hover:text-teal-300"
        >
          +
        </label>

        <input
          id="chat-file"
          type="file"
          className="hidden"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={(e) => {
            setImage(e.target.files?.[0] || null);
          }}
        />

        {/* Message Input */}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          aria-label="Type your message"
          className="h-11 min-w-0 flex-1 rounded-xl border border-white/10 bg-[#09090f]/90 px-3 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-teal-400/50 focus:ring-2 focus:ring-teal-400/10 sm:px-4"
        />

        {/* Send Button */}
        <button
          type="submit"
          disabled={!input.trim() && !image}
          aria-label="Send message"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-teal-400 to-purple-500 text-[#09090f] shadow-lg shadow-teal-500/10 transition hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <FontAwesomeIcon icon={faPaperPlane} />
        </button>
      </div>

      {/* Selected Image Preview */}
      {image && (
        <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-purple-400/20 bg-purple-500/5 px-3 py-2">
          <p className="min-w-0 truncate text-xs text-gray-300">
            Image selected: {image.name}
          </p>

          <button
            type="button"
            onClick={() => setImage(null)}
            className="shrink-0 text-xs font-medium text-red-300 transition hover:text-red-200"
          >
            Remove
          </button>
        </div>
      )}
    </form>
  </div>
) : (
  <div className="flex h-full min-h-0 flex-1 items-center justify-center overflow-hidden border-r border-white/10 bg-[#09090f]/50 px-4 text-center">
    <div className="max-w-sm">
      <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl border border-teal-400/20 bg-gradient-to-br from-teal-400/10 to-purple-500/15 shadow-xl shadow-purple-950/20">
        <FontAwesomeIcon
          className="text-4xl text-teal-300"
          icon={faCommentDots}
        />
      </div>

      <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
        Chat Anytime, Anywhere
      </h2>

      <p className="mt-3 text-sm leading-6 text-gray-400">
        Select a conversation and start connecting with your people.
      </p>

      <div className="mx-auto mt-5 h-1 w-16 rounded-full bg-gradient-to-r from-teal-400 to-purple-500" />
    </div>
  </div>
);

};

export default ChatContainer;
