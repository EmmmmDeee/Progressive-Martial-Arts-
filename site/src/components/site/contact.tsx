"use client";

import { useState } from "react";
import Image from "next/image";
import { Phone, Mail, MapPin, Send, Loader2, CheckCircle2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { siteConfig } from "@/lib/site-config";
import { toast } from "sonner";

export function Contact() {
  const [tab, setTab] = useState("enquiry");

  // Enquiry form
  const [enq, setEnq] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [enqLoading, setEnqLoading] = useState(false);
  const [enqDone, setEnqDone] = useState(false);

  // Trial form
  const [trial, setTrial] = useState({ name: "", email: "", phone: "", art: "", experience: "none" });
  const [trialLoading, setTrialLoading] = useState(false);
  const [trialDone, setTrialDone] = useState(false);

  async function submitEnquiry(e: React.FormEvent) {
    e.preventDefault();
    if (!enq.name || !enq.email || !enq.message) {
      toast.error("Please fill in your name, email and message.");
      return;
    }
    setEnqLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(enq),
      });
      if (!res.ok) throw new Error("Request failed");
      setEnqDone(true);
      toast.success("Message sent! We'll be in touch within 24 hours.");
      setEnq({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch {
      toast.error("Something went wrong. Please call us instead.");
    } finally {
      setEnqLoading(false);
    }
  }

  async function submitTrial(e: React.FormEvent) {
    e.preventDefault();
    if (!trial.name || !trial.email || !trial.phone || !trial.art) {
      toast.error("Please complete all required fields.");
      return;
    }
    setTrialLoading(true);
    try {
      const res = await fetch("/api/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(trial),
      });
      if (!res.ok) throw new Error("Request failed");
      setTrialDone(true);
      toast.success("Trial class booked! Check your email for confirmation.");
      setTrial({ name: "", email: "", phone: "", art: "", experience: "none" });
    } catch {
      toast.error("Something went wrong. Please call us instead.");
    } finally {
      setTrialLoading(false);
    }
  }

  return (
    <section id="contact" className="relative py-20 lg:py-28">
      {/* CTA bg */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/cta-bg.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-5 gap-10 lg:gap-16">
          {/* Left: info */}
          <div className="lg:col-span-2">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-primary">
              <span className="h-px w-8 bg-primary" />
              Get In Touch
            </div>
            <h2 className="mt-4 font-display text-4xl sm:text-5xl font-bold uppercase leading-tight">
              Your first class is on us
            </h2>
            <p className="mt-4 text-foreground/75 leading-relaxed">
              Drop us a line or book a free trial class — we&apos;ll pair you
              with the right instructor and the right art for your goals.
            </p>

            <div className="mt-8 space-y-4">
              <a href={siteConfig.phoneHref} className="group flex items-start gap-3 p-4 rounded-lg border border-border/60 bg-card/60 hover:border-primary/40 transition-colors">
                <span className="h-10 w-10 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                  <Phone className="h-4 w-4" />
                </span>
                <div>
                  <div className="text-xs uppercase tracking-wider text-foreground/50">Call the academy</div>
                  <div className="font-semibold text-foreground group-hover:text-primary transition-colors">{siteConfig.phone}</div>
                  <div className="text-xs text-foreground/55 mt-0.5">Mobile: {siteConfig.mobile}</div>
                </div>
              </a>

              <a href={siteConfig.emailHref} className="group flex items-start gap-3 p-4 rounded-lg border border-border/60 bg-card/60 hover:border-primary/40 transition-colors">
                <span className="h-10 w-10 rounded-md bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shrink-0">
                  <Mail className="h-4 w-4" />
                </span>
                <div>
                  <div className="text-xs uppercase tracking-wider text-foreground/50">Email us</div>
                  <div className="font-semibold text-foreground group-hover:text-accent transition-colors break-all">
                    {siteConfig.email}
                  </div>
                </div>
              </a>

              <div className="flex items-start gap-3 p-4 rounded-lg border border-border/60 bg-card/60">
                <span className="h-10 w-10 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                  <MapPin className="h-4 w-4" />
                </span>
                <div>
                  <div className="text-xs uppercase tracking-wider text-foreground/50">Visit the dojo</div>
                  <div className="font-semibold text-foreground">{siteConfig.address.line1}</div>
                  <div className="text-sm text-foreground/60">{siteConfig.address.line2}</div>
                  <div className="text-xs text-foreground/45 mt-1">{siteConfig.hours}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: forms */}
          <div className="lg:col-span-3">
            <div className="rounded-2xl bg-card border border-border/60 p-6 lg:p-8 shadow-xl shadow-black/20">
              <Tabs value={tab} onValueChange={setTab}>
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="enquiry" className="gap-1.5">
                    <Mail className="h-3.5 w-3.5" />
                    General Enquiry
                  </TabsTrigger>
                  <TabsTrigger value="trial" className="gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    Book Free Trial
                  </TabsTrigger>
                </TabsList>

                {/* Enquiry form */}
                <TabsContent value="enquiry">
                  {enqDone ? (
                    <SuccessState
                      title="Message received"
                      text="Thanks for reaching out — our team will reply within 24 hours."
                      onReset={() => setEnqDone(false)}
                    />
                  ) : (
                    <form onSubmit={submitEnquiry} className="space-y-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label htmlFor="enq-name">Full name *</Label>
                          <Input
                            id="enq-name"
                            value={enq.name}
                            onChange={(e) => setEnq({ ...enq, name: e.target.value })}
                            placeholder="Jane Doe"
                            required
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="enq-email">Email *</Label>
                          <Input
                            id="enq-email"
                            type="email"
                            value={enq.email}
                            onChange={(e) => setEnq({ ...enq, email: e.target.value })}
                            placeholder="jane@email.com"
                            required
                          />
                        </div>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label htmlFor="enq-phone">Phone</Label>
                          <Input
                            id="enq-phone"
                            value={enq.phone}
                            onChange={(e) => setEnq({ ...enq, phone: e.target.value })}
                            placeholder="04xx xxx xxx"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="enq-subject">Subject</Label>
                          <Input
                            id="enq-subject"
                            value={enq.subject}
                            onChange={(e) => setEnq({ ...enq, subject: e.target.value })}
                            placeholder="How can we help?"
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="enq-msg">Message *</Label>
                        <Textarea
                          id="enq-msg"
                          rows={4}
                          value={enq.message}
                          onChange={(e) => setEnq({ ...enq, message: e.target.value })}
                          placeholder="Tell us about your goals, experience level, or what you'd like to know..."
                          required
                        />
                      </div>
                      <Button type="submit" disabled={enqLoading} className="w-full bg-primary hover:bg-primary/90">
                        {enqLoading ? (
                          <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Sending...</>
                        ) : (
                          <><Send className="h-4 w-4 mr-2" /> Send message</>
                        )}
                      </Button>
                    </form>
                  )}
                </TabsContent>

                {/* Trial form */}
                <TabsContent value="trial">
                  {trialDone ? (
                    <SuccessState
                      title="Trial class booked!"
                      text="Check your inbox for confirmation and what to bring. We can't wait to meet you on the mat."
                      onReset={() => setTrialDone(false)}
                    />
                  ) : (
                    <form onSubmit={submitTrial} className="space-y-4">
                      <div className="rounded-lg bg-accent/5 border border-accent/20 p-3 text-sm text-foreground/70 flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                        <span>
                          Your first class is <span className="font-semibold text-accent">100% free</span>. No commitment, no gear needed — just comfortable clothes.
                        </span>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label htmlFor="trial-name">Full name *</Label>
                          <Input
                            id="trial-name"
                            value={trial.name}
                            onChange={(e) => setTrial({ ...trial, name: e.target.value })}
                            placeholder="Your name"
                            required
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="trial-phone">Mobile *</Label>
                          <Input
                            id="trial-phone"
                            value={trial.phone}
                            onChange={(e) => setTrial({ ...trial, phone: e.target.value })}
                            placeholder="04xx xxx xxx"
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="trial-email">Email *</Label>
                        <Input
                          id="trial-email"
                          type="email"
                          value={trial.email}
                          onChange={(e) => setTrial({ ...trial, email: e.target.value })}
                          placeholder="you@email.com"
                          required
                        />
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label htmlFor="trial-art">Art of interest *</Label>
                          <Select
                            value={trial.art}
                            onValueChange={(v) => setTrial({ ...trial, art: v })}
                          >
                            <SelectTrigger id="trial-art">
                              <SelectValue placeholder="Select an art" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Muay Thai">Muay Thai</SelectItem>
                              <SelectItem value="Brazilian Jiu Jitsu">Brazilian Jiu Jitsu</SelectItem>
                              <SelectItem value="Kali">Kali</SelectItem>
                              <SelectItem value="Jeet Kune Do">Jeet Kune Do</SelectItem>
                              <SelectItem value="Maphilindo Silat">Maphilindo Silat</SelectItem>
                              <SelectItem value="Jun Fan Gung Fu">Jun Fan Gung Fu</SelectItem>
                              <SelectItem value="Mini Muscles (Kids)">Mini Muscles (Kids)</SelectItem>
                              <SelectItem value="Not sure yet">Not sure yet</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="trial-exp">Experience level</Label>
                          <Select
                            value={trial.experience}
                            onValueChange={(v) => setTrial({ ...trial, experience: v })}
                          >
                            <SelectTrigger id="trial-exp">
                              <SelectValue placeholder="Select level" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">Complete beginner</SelectItem>
                              <SelectItem value="beginner">Beginner (under 1 yr)</SelectItem>
                              <SelectItem value="intermediate">Intermediate (1–5 yrs)</SelectItem>
                              <SelectItem value="advanced">Advanced (5+ yrs)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <Button type="submit" disabled={trialLoading} className="w-full bg-primary hover:bg-primary/90">
                        {trialLoading ? (
                          <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Booking...</>
                        ) : (
                          <><Calendar className="h-4 w-4 mr-2" /> Book my free trial class</>
                        )}
                      </Button>
                    </form>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SuccessState({ title, text, onReset }: { title: string; text: string; onReset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-10">
      <div className="h-14 w-14 rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center mb-4">
        <CheckCircle2 className="h-7 w-7 text-accent" />
      </div>
      <h3 className="font-display text-2xl font-bold uppercase">{title}</h3>
      <p className="mt-2 text-sm text-foreground/70 max-w-sm">{text}</p>
      <Button variant="outline" className="mt-6" onClick={onReset}>
        Send another
      </Button>
    </div>
  );
}
