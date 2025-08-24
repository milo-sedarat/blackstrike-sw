"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import CuteRobotIcon from "@/components/icons/cute-robot"
import { ChevronUp, ChevronDown, Send, Zap } from "lucide-react"

interface Message {
  id: string
  content: string
  isBot: boolean
  timestamp: Date
}

export default function AIChatbot() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hello! I'm your AI trading assistant. I can help you analyze markets, optimize bot strategies, and answer trading questions.",
      isBot: true,
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      isBot: false,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content:
          "I understand your question about trading strategies. Let me analyze the current market conditions and provide you with some insights...",
        isBot: true,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botMessage])
      setIsTyping(false)
    }, 1500)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <Card className="bg-sidebar border-sidebar-border">
      <CardHeader className="pb-3 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <CardTitle className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-blue-500/10">
              <CuteRobotIcon className="size-4 text-blue-400" />
            </div>
            <span>AI Assistant</span>
            <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
              <Zap className="size-3 mr-1" />
              Online
            </Badge>
          </div>
          {isExpanded ? (
            <ChevronUp className="size-4 text-sidebar-foreground/60" />
          ) : (
            <ChevronDown className="size-4 text-sidebar-foreground/60" />
          )}
        </CardTitle>
      </CardHeader>

      {isExpanded && (
        <CardContent className="pt-0 space-y-3">
          <ScrollArea className="h-48 w-full">
            <div className="space-y-3 pr-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn("flex gap-2 text-xs", message.isBot ? "justify-start" : "justify-end")}
                >
                  {message.isBot && (
                    <div className="p-1 rounded-full bg-blue-500/10 shrink-0 mt-0.5">
                      <CuteRobotIcon className="size-3 text-blue-400" />
                    </div>
                  )}
                  <div
                    className={cn(
                      "max-w-[80%] p-2 rounded-lg text-xs leading-relaxed",
                      message.isBot
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "bg-blue-500 text-white ml-auto",
                    )}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-2 justify-start">
                  <div className="p-1 rounded-full bg-blue-500/10 shrink-0 mt-0.5">
                    <CuteRobotIcon className="size-3 text-blue-400" />
                  </div>
                  <div className="bg-sidebar-accent text-sidebar-accent-foreground p-2 rounded-lg text-xs">
                    <div className="flex gap-1">
                      <div className="w-1 h-1 bg-current rounded-full animate-bounce" />
                      <div
                        className="w-1 h-1 bg-current rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      />
                      <div
                        className="w-1 h-1 bg-current rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="flex gap-2">
            <Input
              placeholder="Ask about trading strategies..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              className="text-xs h-8 bg-sidebar-accent/50 border-sidebar-border"
            />
            <Button
              size="sm"
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping}
              className="h-8 w-8 p-0 bg-blue-500 hover:bg-blue-600"
            >
              <Send className="size-3" />
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
