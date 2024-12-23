"use client";

import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { MessageCircle, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { DrizzleChat } from "@/lib/db/schemas";

type Props = {
    chats: DrizzleChat[];
    chatId: number;
};

const ChatSideBar = ({ chats, chatId }: Props) => {
    const [loading, setLoading] = React.useState(false);

    return (
        <div className="w-full h-screen flex flex-col text-gray-200 bg-gray-900">
            <div className="p-4">
                <Link href="/">
                    <Button className="w-full border-dashed border-white border">
                        <PlusCircle className="mr-2 w-4 h-4" />
                        New Chat
                    </Button>
                </Link>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
                <div className="flex flex-col gap-2">
                    {chats.map((chat) => (
                        <Link key={chat.id} href={`/chat/${chat.id}`}>
                            <div
                                className={cn("rounded-lg p-3 text-slate-300 flex items-center", {
                                    "bg-blue-600 text-white": chat.id === chatId,
                                    "hover:text-white": chat.id !== chatId,
                                })}
                            >
                                <MessageCircle className="mr-2" />
                                <p className="w-full overflow-hidden text-sm truncate whitespace-nowrap text-ellipsis">
                                    {chat.pdfName}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ChatSideBar;
