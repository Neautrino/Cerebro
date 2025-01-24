'use client'

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

export function ChatPanel() {
  const [message, setMessage] = useState("");
  const [currentChatId, setCurrentChatId] = useState<Id<"chats"> | null>(null);
  
  const chats = useQuery(api.chat.listChats);
  const currentChat = currentChatId 
    ? useQuery(api.chat.getChat, { chatId: currentChatId })
    : null;
  const sendMessage = useMutation(api.chat.sendMessage);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const result = await sendMessage({
      message: message.trim(),
      chatId: currentChatId ?? undefined,
    });

    setCurrentChatId(result.chatId);
    setMessage("");
  };

  return (
    <div className="flex h-full">
      {/* Chat list sidebar */}
      <div className="w-64 border-r p-4">
        <h2 className="font-bold mb-4">Conversations</h2>
        <div className="space-y-2">
          {chats?.map((chat) => (
            <div
              key={chat._id}
              className={`p-2 cursor-pointer rounded ${
                currentChatId === chat._id ? "bg-blue-100" : "hover:bg-gray-100"
              }`}
              onClick={() => setCurrentChatId(chat._id)}
            >
              {chat.title}
            </div>
          ))}
        </div>
      </div>

      {/* Chat main area */}
      <div className="flex-1 flex flex-col">
        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto">
          {currentChat?.messages.map((msg, i) => (
            <div
              key={i}
              className={`mb-4 ${
                msg.role === "user" ? "text-right" : "text-left"
              }`}
            >
              <div
                className={`inline-block p-2 rounded-lg ${
                  msg.role === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
        </div>

        {/* Input area */}
        <form onSubmit={handleSubmit} className="p-4 border-t">
          <div className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 border rounded-lg p-2"
              placeholder="Type your message..."
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 