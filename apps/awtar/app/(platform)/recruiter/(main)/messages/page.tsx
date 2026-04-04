"use client";

import {
    Search,
    Phone,
    MoreVertical,
    Paperclip,
    Mic,
    Smile,
    Send,
    ChevronLeft,
} from "lucide-react";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";

type Message = {
    id: number;
    from: "me" | "them";
    text: string;
    time: string;
};

type Conversation = {
    id: number;
    name: string;
    avatar: string;
    preview: string;
    time: string;
    unread: boolean;
    tag?: string;
    messages: Message[];
};

const INITIAL_CONVERSATIONS: Conversation[] = [
    {
        id: 1,
        name: "Alex Johnson",
        avatar: "https://i.pravatar.cc/100?img=3",
        preview: "Hey! How's it going?",
        time: "2m ago",
        unread: true,
        tag: "New",
        messages: [
            { id: 1, from: "me", text: "Hi Alex, thank you for applying to the UI/UX Designer for Mobile App position. We've reviewed your portfolio, and we're impressed!\nWould you be available for a quick Zoom interview this Thursday at 2:00 PM?", time: "6:34 pm" },
            { id: 2, from: "them", text: "Hi! Thanks for the opportunity. Yes, Thursday at 2:00 PM works perfectly. Please send over the meeting link. Looking forward to it!", time: "6:35 pm" },
            { id: 3, from: "me", text: "Great! Here's the Zoom link for the call:\nLet us know if anything changes. See you Thursday!", time: "6:36 pm" },
        ],
    },
    {
        id: 2,
        name: "Emily Davis",
        avatar: "https://i.pravatar.cc/100?img=5",
        preview: "Meeting at 3 PM.",
        time: "10m ago",
        unread: false,
        messages: [
            { id: 1, from: "them", text: "Meeting at 3 PM. Are we still on?", time: "6:24 pm" },
            { id: 2, from: "me", text: "Yes, absolutely. I'll send the calendar invite now.", time: "6:25 pm" },
        ],
    },
    {
        id: 3,
        name: "Jessica Lee",
        avatar: "https://i.pravatar.cc/100?img=9",
        preview: "Could you send me the files?",
        time: "20m ago",
        unread: false,
        messages: [
            { id: 1, from: "them", text: "Could you send me the files?", time: "6:14 pm" },
        ],
    },
    {
        id: 4,
        name: "Sophia Turner",
        avatar: "https://i.pravatar.cc/100?img=33",
        preview: "Don't forget our lunch tomorrow!",
        time: "45m ago",
        unread: false,
        messages: [
            { id: 1, from: "them", text: "Don't forget our lunch tomorrow!", time: "5:49 pm" },
        ],
    },
    {
        id: 5,
        name: "Michael Brown",
        avatar: "https://i.pravatar.cc/100?img=11",
        preview: "Ready for the presentation?",
        time: "1h ago",
        unread: false,
        messages: [
            { id: 1, from: "them", text: "Ready for the presentation?", time: "5:34 pm" },
            { id: 2, from: "me", text: "Almost! Just polishing the last slide.", time: "5:35 pm" },
        ],
    },
    {
        id: 6,
        name: "Olivia Smith",
        avatar: "https://i.pravatar.cc/100?img=60",
        preview: "Let's catch up later!",
        time: "1h 30m ago",
        unread: false,
        messages: [
            { id: 1, from: "them", text: "Let's catch up later!", time: "5:04 pm" },
        ],
    },
    {
        id: 7,
        name: "Ava Martinez",
        avatar: "https://i.pravatar.cc/100?img=45",
        preview: "Any updates on the project?",
        time: "2h 15m ago",
        unread: false,
        messages: [
            { id: 1, from: "them", text: "Any updates on the project?", time: "4:19 pm" },
            { id: 2, from: "me", text: "Still waiting on the design assets.", time: "4:20 pm" },
        ],
    },
    {
        id: 8,
        name: "Noah Garcia",
        avatar: "https://i.pravatar.cc/100?img=68",
        preview: "Can you review my code?",
        time: "3h ago",
        unread: false,
        messages: [
            { id: 1, from: "them", text: "Can you review my code?", time: "3:34 pm" },
        ],
    },
];

export default function MessagesPage() {
    const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
    const [activeId, setActiveId] = useState<number>(1);
    const [draftText, setDraftText] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const activeConversation = conversations.find(c => c.id === activeId)!;

    const filteredConversations = conversations.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.preview.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const sendMessage = () => {
        if (!draftText.trim()) return;
        const now = new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }).toLowerCase();
        const newMsg: Message = { id: Date.now(), from: "me", text: draftText.trim(), time: now };
        setConversations(conversations.map(c =>
            c.id === activeId
                ? { ...c, messages: [...c.messages, newMsg], preview: draftText.trim(), time: "just now" }
                : c
        ));
        setDraftText("");
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [activeConversation?.messages.length]);

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden" style={{ height: "calc(100vh - 160px)" }}>
            <div className="flex h-full">
                {/* ── SIDEBAR ── */}
                <div className="w-56 border-r border-gray-100 flex flex-col flex-shrink-0">
                    {/* Search */}
                    <div className="p-3 border-b border-gray-100">
                        <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2">
                            <Search className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                            <input
                                type="text"
                                placeholder="Search"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="bg-transparent text-xs text-gray-700 placeholder:text-gray-400 focus:outline-none w-full"
                            />
                        </div>
                    </div>

                    {/* Conversation list */}
                    <div className="flex-1 overflow-y-auto">
                        {filteredConversations.map(conv => (
                            <button
                                key={conv.id}
                                onClick={() => {
                                    setActiveId(conv.id);
                                    setConversations(conversations.map(c => c.id === conv.id ? { ...c, unread: false } : c));
                                }}
                                className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors ${
                                    conv.id === activeId ? "bg-blue-600" : "hover:bg-gray-50"
                                }`}
                            >
                                <div className="relative flex-shrink-0">
                                    <Image
                                        src={conv.avatar}
                                        alt={conv.name}
                                        width={36}
                                        height={36}
                                        className="rounded-full object-cover"
                                    />
                                    {conv.unread && conv.id !== activeId && (
                                        <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-blue-500 rounded-full border border-white" />
                                    )}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center justify-between">
                                        <p className={`text-xs font-bold truncate ${conv.id === activeId ? "text-white" : "text-gray-900"}`}>
                                            {conv.name}
                                        </p>
                                        <span className={`text-[10px] ml-1 flex-shrink-0 ${conv.id === activeId ? "text-blue-200" : "text-gray-400"}`}>
                                            {conv.time}
                                        </span>
                                    </div>
                                    <p className={`text-[11px] truncate mt-0.5 ${conv.id === activeId ? "text-blue-100" : "text-gray-500"}`}>
                                        {conv.preview}
                                    </p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* ── CHAT PANEL ── */}
                <div className="flex-1 flex flex-col min-w-0">
                    {/* Chat Header */}
                    <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between bg-white">
                        <div className="flex items-center gap-3">
                            <button className="text-gray-400 hover:text-blue-600 transition-colors">
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <span className="text-sm font-bold text-gray-900">{activeConversation.name}</span>
                            {activeConversation.tag && (
                                <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded uppercase tracking-widest">
                                    {activeConversation.tag}
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-4 text-gray-400">
                            <button className="hover:text-blue-600 transition-colors"><Search className="w-4 h-4" /></button>
                            <button className="hover:text-blue-600 transition-colors"><Phone className="w-4 h-4" /></button>
                            <button className="hover:text-gray-600 transition-colors"><MoreVertical className="w-4 h-4" /></button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 bg-gray-50/30">
                        {activeConversation.messages.map(msg => (
                            <div key={msg.id} className={`flex ${msg.from === "me" ? "justify-end" : "justify-start"} items-end gap-2`}>
                                {msg.from === "them" && (
                                    <Image
                                        src={activeConversation.avatar}
                                        alt={activeConversation.name}
                                        width={28}
                                        height={28}
                                        className="rounded-full object-cover flex-shrink-0 mb-4"
                                    />
                                )}
                                <div className={`max-w-[65%] group`}>
                                    <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                                        msg.from === "me"
                                            ? "bg-blue-600 text-white rounded-br-sm"
                                            : "bg-white text-gray-800 border border-gray-100 shadow-sm rounded-bl-sm"
                                    }`}>
                                        {msg.text}
                                    </div>
                                    <div className={`flex items-center gap-1 mt-1 ${msg.from === "me" ? "justify-end" : "justify-start"}`}>
                                        <span className="text-[10px] text-gray-400">{msg.time}</span>
                                        <button className="text-gray-300 hover:text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <MoreVertical className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Bar */}
                    <div className="px-4 py-3 border-t border-gray-100 bg-white">
                        <div className="flex items-center gap-3">
                            <button className="text-gray-400 hover:text-blue-600 transition-colors flex-shrink-0">
                                <Paperclip className="w-4 h-4" />
                            </button>
                            <input
                                type="text"
                                placeholder="Type a message..."
                                value={draftText}
                                onChange={e => setDraftText(e.target.value)}
                                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                                className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button className="text-gray-400 hover:text-blue-600 transition-colors flex-shrink-0">
                                <Mic className="w-4 h-4" />
                            </button>
                            <button className="text-gray-400 hover:text-blue-600 transition-colors flex-shrink-0">
                                <Smile className="w-4 h-4" />
                            </button>
                            <button
                                onClick={sendMessage}
                                disabled={!draftText.trim()}
                                className="flex items-center gap-1.5 bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Send <Send className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
