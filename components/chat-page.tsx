"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Send, Phone, Video, Info, Search, MoreHorizontal, Smile, Paperclip } from "lucide-react"
import { useState } from "react"

const conversations = [
  {
    id: 1,
    username: "john_doe",
    name: "John Doe",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Hey! How are you doing?",
    timestamp: "2m",
    unread: 2,
    online: true,
  },
  {
    id: 2,
    username: "jane_smith",
    name: "Jane Smith",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Thanks for sharing that photo!",
    timestamp: "1h",
    unread: 0,
    online: true,
  },
  {
    id: 3,
    username: "travel_blog",
    name: "Travel Blog",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Check out this amazing place I visited",
    timestamp: "3h",
    unread: 1,
    online: false,
  },
  {
    id: 4,
    username: "food_lover",
    name: "Food Lover",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "That recipe looks delicious!",
    timestamp: "1d",
    unread: 0,
    online: false,
  },
  {
    id: 5,
    username: "tech_news",
    name: "Tech News",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Did you see the latest tech announcement?",
    timestamp: "2d",
    unread: 0,
    online: true,
  },
]

const messages = [
  {
    id: 1,
    sender: "john_doe",
    content: "Hey! How are you doing?",
    timestamp: "10:30 AM",
    isOwn: false,
  },
  {
    id: 2,
    sender: "me",
    content: "I'm doing great! Just posted some new photos from my trip",
    timestamp: "10:32 AM",
    isOwn: true,
  },
  {
    id: 3,
    sender: "john_doe",
    content: "That's awesome! I saw them, they look incredible 📸",
    timestamp: "10:33 AM",
    isOwn: false,
  },
  {
    id: 4,
    sender: "me",
    content: "Thanks! The sunset was absolutely perfect that day",
    timestamp: "10:35 AM",
    isOwn: true,
  },
  {
    id: 5,
    sender: "john_doe",
    content: "Where was this taken? I'd love to visit sometime",
    timestamp: "10:36 AM",
    isOwn: false,
  },
  {
    id: 6,
    sender: "me",
    content: "It's in the mountains near Lake Tahoe. Perfect spot for photography!",
    timestamp: "10:38 AM",
    isOwn: true,
  },
]

export function ChatPage() {
  const [selectedChat, setSelectedChat] = useState<number | null>(1)
  const [newMessage, setNewMessage] = useState("")

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Here you would typically send the message to your backend
      console.log("Sending message:", newMessage)
      setNewMessage("")
    }
  }

  const selectedConversation = conversations.find((conv) => conv.id === selectedChat)

  return (
    <div className="h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="md:hidden sticky top-0 z-10 bg-white border-b px-4 py-3">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold">Messages</h1>
        </div>
      </div>

      <div className="flex h-full md:h-[calc(100vh-80px)]">
        {/* Chat List - Left Panel */}
        <div className={`${selectedChat && "hidden md:block"} w-full md:w-80 bg-white border-r`}>
          {/* Desktop Header */}
          <div className="hidden md:block p-4 border-b">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Messages</h2>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="w-6 h-6" />
              </Button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input placeholder="Search messages" className="pl-10 bg-gray-100 border-0" />
            </div>
          </div>

          {/* Conversations List */}
          <ScrollArea className="h-full">
            <div className="p-2">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => setSelectedChat(conversation.id)}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-gray-100 ${
                    selectedChat === conversation.id ? "bg-blue-50 border border-blue-200" : ""
                  }`}
                >
                  <div className="relative">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={conversation.avatar || "/placeholder.svg"} alt={conversation.name} />
                      <AvatarFallback>{conversation.name[0]}</AvatarFallback>
                    </Avatar>
                    {conversation.online && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-sm truncate">{conversation.name}</h3>
                      <span className="text-xs text-gray-500">{conversation.timestamp}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                      {conversation.unread > 0 && (
                        <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                          {conversation.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Chat Area - Right Panel */}
        {selectedChat ? (
          <div className={`${!selectedChat && "hidden"} flex-1 flex flex-col bg-white`}>
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage
                    src={selectedConversation?.avatar || "/placeholder.svg"}
                    alt={selectedConversation?.name}
                  />
                  <AvatarFallback>{selectedConversation?.name?.[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{selectedConversation?.name}</h3>
                  <p className="text-sm text-gray-500">
                    {selectedConversation?.online ? "Active now" : "Last seen recently"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Phone className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Video className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Info className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.isOwn ? "justify-end" : "justify-start"}`}>
                    <div className={`flex gap-2 max-w-xs lg:max-w-md ${message.isOwn ? "flex-row-reverse" : ""}`}>
                      {!message.isOwn && (
                        <Avatar className="w-8 h-8">
                          <AvatarImage
                            src={selectedConversation?.avatar || "/placeholder.svg"}
                            alt={selectedConversation?.name}
                          />
                          <AvatarFallback>{selectedConversation?.name?.[0]}</AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={`px-4 py-2 rounded-2xl ${
                          message.isOwn
                            ? "bg-blue-500 text-white rounded-br-md"
                            : "bg-gray-100 text-gray-900 rounded-bl-md"
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-xs mt-1 ${message.isOwn ? "text-blue-100" : "text-gray-500"}`}>
                          {message.timestamp}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Paperclip className="w-5 h-5" />
                </Button>
                <div className="flex-1 relative">
                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    className="pr-10"
                  />
                  <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 transform -translate-y-1/2">
                    <Smile className="w-5 h-5" />
                  </Button>
                </div>
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="hidden md:flex flex-1 items-center justify-center bg-white">
            <div className="text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Your Messages</h3>
              <p className="text-gray-500">Send private photos and messages to a friend or group.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
