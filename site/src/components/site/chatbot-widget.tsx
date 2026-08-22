"use client";

import { useState, useRef, useEffect, type FormEvent } from "react";
import { MessageCircle, X, Send, Sparkles, Loader2, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Message = { role: "user" | "assistant"; content: string };

const SUGGESTED = [
  "Which martial art is right for me?",
  "What should I bring to my first class?",
  "How much does membership cost?",
  "Do you have kids classes?",
];

const WELCOME: Message = {
  role: "assistant",
  content:
    "Hi! I'm the PMAAI virtual assistant. I can help you find the right martial art, answer questions about classes, or help you book a free trial. What would you like to know?",
};

export function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const newMessages: Message[] = [...messages, { role: "user", content: trimmed }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          history: newMessages.slice(1, -1),
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setMessages((m) => [...m, { role: "assistant", content: data.response }]);
      } else {
        setMessages((m) => [
          ...m,
          {
            role: "assistant",
            content:
              "I'm having trouble right now. Please call us on (07) 3393 9329 and our team will help.",
          },
        ]);
      }
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content:
            "I couldn't connect just now. Please call us on (07) 3393 9329 and we'll get you sorted.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    send(input);
  }

  return (
    <>
      {/* Floating button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-label={open ? "Close chat" : "Open chat assistant"}
        className={cn(
          "fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-2xl shadow-primary/30 flex items-center justify-center transition-all duration-300 group",
          open
            ? "bg-card border border-border text-foreground rotate-90"
            : "bg-primary text-primary-foreground hover:scale-110 pulse-glow"
        )}
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        {!open && (
          <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-accent ring-2 ring-background animate-pulse" />
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[400px] max-w-[400px] h-[520px] max-h-[70vh] flex flex-col rounded-2xl bg-card border border-border shadow-2xl shadow-black/40 overflow-hidden animate-fade-up">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-to-r from-primary/15 to-accent/10 glass">
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-primary" />
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-card" />
              </div>
              <div>
                <div className="font-display font-bold text-sm uppercase tracking-wide text-foreground">
                  PMAAI Assistant
                </div>
                <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Online · replies instantly
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="h-8 w-8 rounded-md hover:bg-secondary/60 flex items-center justify-center text-foreground/60 hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-3 bg-background/40"
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                className={cn(
                  "flex",
                  msg.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-card border border-border text-foreground rounded-bl-sm"
                  )}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-card border border-border rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-2">
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                  <span className="text-xs text-foreground/50">Thinking…</span>
                </div>
              </div>
            )}

            {/* Suggested prompts (only show before first user message) */}
            {messages.length === 1 && !loading && (
              <div className="pt-2 space-y-2">
                <div className="text-[10px] uppercase tracking-wider text-foreground/40 px-1">
                  Suggested questions
                </div>
                {SUGGESTED.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => send(q)}
                    className="block w-full text-left text-xs px-3 py-2 rounded-lg bg-card border border-border hover:border-primary/40 hover:bg-primary/5 text-foreground/75 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-3 border-t border-border bg-card">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about martial arts, classes, pricing…"
                disabled={loading}
                maxLength={500}
                className="flex-1 rounded-lg bg-background border border-border px-3 py-2 text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 disabled:opacity-50"
              />
              <Button
                type="submit"
                size="icon"
                disabled={loading || !input.trim()}
                className="bg-primary hover:bg-primary/90 shrink-0"
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-2 flex items-center justify-between text-[10px] text-foreground/40">
              <span>Powered by AI · may make mistakes</span>
              <a href="tel:+61733939329" className="flex items-center gap-1 hover:text-accent transition-colors">
                <Phone className="h-2.5 w-2.5" />
                Prefer to call?
              </a>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
