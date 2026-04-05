import { useState, useRef, useEffect } from "react";
import dummyProductData from "@/assets/dummy.json";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MessageCircle, Send, Bot, User, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

// Define the expected role for the API
type ApiRole = "human" | "ai";

const ChatBot = () => {
  // --- States and Refs ---
  const [productData, setProductData] = useState<any>(dummyProductData);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm Sattva Bot. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // --- Effects ---
  useEffect(() => {
    // @ts-ignore - For demo purposes to allow other components to set data
    window.setSattvaProductData = setProductData;
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // --- API Call Logic ---
  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = inputText;
    setInputText("");
    setIsLoading(true);

    try {
      // --- FIX: Correctly map roles and filter initial bot message ---
      const chat_history = messages
        .filter((msg) => msg.id !== "1") // Exclude the initial welcome message
        .map((msg) => ({
          role: msg.sender === "user" ? "human" : "ai",
          content: msg.text,
        }));

      // Add the new user message to the history for the current request
      chat_history.push({ role: "human", content: currentInput });

      // --- FIX: Send productData directly without extra wrapping ---
      const requestBody = {
        product_data: productData,
        question: currentInput,
        chat_history: chat_history,
      };

      const response = await fetch(
        "https://sattva-chain-processor.onrender.com/agent/product-chatbot",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.answer || "Sorry, I couldn't get a response.",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Failed to fetch AI response:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I'm having trouble connecting. Please try again later.",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // --- JSX Rendering ---
  return (
    <>
      {/* Chat Toggle Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-glow",
          isOpen
            ? "bg-destructive hover:bg-destructive/90"
            : "bg-gradient-primary hover:shadow-glow"
        )}
        size="icon"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-24 right-6 w-80 h-96 z-40 flex flex-col shadow-glow animate-scale-in">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-primary text-primary-foreground rounded-t-lg">
            <div className="flex items-center space-x-2">
              <Bot className="w-5 h-5" />
              <span className="font-semibold">Sattva Bot</span>
            </div>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse-slow" />
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex items-start space-x-2",
                  message.sender === "user" ? "justify-end" : "justify-start"
                )}
              >
                {message.sender === "bot" && (
                  <div className="w-6 h-6 bg-gradient-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-3 h-3 text-primary-foreground" />
                  </div>
                )}

                <div
                  className={cn(
                    "max-w-[70%] p-3 rounded-lg text-sm",
                    message.sender === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  <p className="whitespace-pre-line">{message.text}</p>
                </div>

                {message.sender === "user" && (
                  <div className="w-6 h-6 bg-sage rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-3 h-3 text-foreground" />
                  </div>
                )}
              </div>
            ))}
            {/* Add a "thinking" indicator while waiting for the API response */}
            {isLoading && (
              <div className="flex items-start space-x-2 justify-start">
                <div className="w-6 h-6 bg-gradient-primary rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-3 h-3 text-primary-foreground" />
                </div>
                <div className="max-w-[70%] p-3 rounded-lg text-sm bg-muted text-muted-foreground">
                  <p className="animate-pulse-slow">
                    Sattva Bot is thinking...
                  </p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border">
            <div className="flex space-x-2">
              <Input
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask about herb authenticity..."
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                className="flex-1"
                disabled={isLoading}
              />
              <Button
                onClick={handleSendMessage}
                size="icon"
                variant="sage"
                disabled={!inputText.trim() || isLoading}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </>
  );
};

export default ChatBot;
