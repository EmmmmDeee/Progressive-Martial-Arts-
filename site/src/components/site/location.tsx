import Image from "next/image";
import { MapPin, Clock, Phone, Navigation, Car, Dumbbell, Shield, Wifi, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/site/section-heading";
import { siteConfig } from "@/lib/site-config";

const hours = [
  { day: "Monday", time: "6:00am – 9:00pm", classes: true },
  { day: "Tuesday", time: "6:00pm – 9:00pm", classes: true },
  { day: "Wednesday", time: "6:00am – 9:00pm", classes: true },
  { day: "Thursday", time: "6:00pm – 9:00pm", classes: true },
  { day: "Friday", time: "6:00am – 8:30pm", classes: true },
  { day: "Saturday", time: "9:00am – 1:00pm", classes: true },
  { day: "Sunday", time: "Closed", classes: false },
];

const facilities = [
  { icon: Dumbbell, label: "Main training mat", desc: "200m² sprung floor" },
  { icon: Shield, label: "Weapons mat", desc: "Dedicated Kali/Silat area" },
  { icon: Dumbbell, label: "Progressive Strength gym", desc: "24/7 members access" },
  { icon: Car, label: "On-site parking", desc: "Free for students" },
  { icon: Camera, label: "CCTV monitored", desc: "Safe & secure" },
  { icon: Wifi, label: "Changing rooms & showers", desc: "Male & female" },
];

export function Location() {
  // Determine today's open/closed status
  const today = new Date().toLocaleDateString("en-AU", { weekday: "long" });
  const todayHours = hours.find((h) => h.day === today);

  return (
    <section id="location" className="relative py-20 lg:py-28 bg-secondary/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          align="center"
          eyebrow="Find Us"
          title={<>Visit the <span className="text-gradient-gold">academy</span></>}
          description="One roof, every training need. Martial arts dojo and 24/7 strength gym side by side in Tingalpa — eastern Brisbane."
        />

        <div className="mt-12 grid lg:grid-cols-2 gap-8 items-stretch">
          {/* Map embed */}
          <div className="relative rounded-2xl overflow-hidden border border-border/60 bg-card min-h-[360px] lg:min-h-full">
            <iframe
              title="PMAAI location map"
              src="https://www.openstreetmap.org/export/embed.html?bbox=153.155%2C-27.490%2C153.180%2C-27.475&layer=mapnik&marker=-27.4833%2C153.1667"
              className="w-full h-full min-h-[360px] absolute inset-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            {/* Overlay info card */}
            <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-xs rounded-xl bg-background/95 backdrop-blur-md border border-border/80 p-4 shadow-xl">
              <div className="flex items-start gap-2 mb-2">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <div className="font-display font-bold text-sm uppercase">PMAAI Dojo</div>
                  <div className="text-xs text-foreground/60 mt-0.5">{siteConfig.address.line1}</div>
                  <div className="text-xs text-foreground/60">{siteConfig.address.line2}</div>
                </div>
              </div>
              <Button asChild size="sm" className="w-full mt-3 bg-primary hover:bg-primary/90 group">
                <a
                  href="https://www.google.com/maps/dir/?api=1&destination=180+New+Cleveland+Road+Tingalpa+QLD+4173"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Navigation className="mr-1.5 h-3.5 w-3.5" />
                  Get directions
                </a>
              </Button>
            </div>
          </div>

          {/* Info: hours + contact + facilities */}
          <div className="flex flex-col gap-6">
            {/* Hours */}
            <div className="rounded-2xl border border-border/60 bg-card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-accent" />
                  <h3 className="font-display font-bold uppercase text-sm tracking-wide">Opening Hours</h3>
                </div>
                {todayHours && (
                  <Badge
                    variant="outline"
                    className={todayHours.classes ? "border-emerald-500/40 text-emerald-400 bg-emerald-500/10" : "border-red-500/40 text-red-400 bg-red-500/10"}
                  >
                    {todayHours.classes ? "Open today" : "Closed today"}
                  </Badge>
                )}
              </div>
              <div className="space-y-1.5">
                {hours.map((h) => (
                  <div
                    key={h.day}
                    className={`flex items-center justify-between py-1.5 px-2 rounded text-sm ${
                      h.day === today ? "bg-accent/10 border border-accent/20" : ""
                    }`}
                  >
                    <span className={`${h.day === today ? "font-semibold text-accent" : "text-foreground/70"} flex items-center gap-1.5`}>
                      {h.day === today && <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />}
                      {h.day}
                    </span>
                    <span className={h.classes ? "text-foreground/80" : "text-foreground/40"}>{h.time}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-3 border-t border-border/60 text-xs text-foreground/50 flex items-center gap-1.5">
                <Dumbbell className="h-3.5 w-3.5 text-primary" />
                Progressive Strength gym open 24/7 for members
              </div>
            </div>

            {/* Contact quick row */}
            <div className="grid grid-cols-2 gap-3">
              <a
                href={siteConfig.phoneHref}
                className="rounded-xl border border-border/60 bg-card p-4 hover:border-primary/40 hover:bg-primary/5 transition-all group"
              >
                <Phone className="h-5 w-5 text-primary mb-2 group-hover:scale-110 transition-transform" />
                <div className="text-[10px] uppercase tracking-wider text-foreground/50">Call us</div>
                <div className="text-sm font-semibold text-foreground mt-0.5">{siteConfig.phone}</div>
              </a>
              <a
                href={siteConfig.emailHref}
                className="rounded-xl border border-border/60 bg-card p-4 hover:border-accent/40 hover:bg-accent/5 transition-all group"
              >
                <MapPin className="h-5 w-5 text-accent mb-2 group-hover:scale-110 transition-transform" />
                <div className="text-[10px] uppercase tracking-wider text-foreground/50">Email</div>
                <div className="text-sm font-semibold text-foreground mt-0.5 truncate">{siteConfig.email}</div>
              </a>
            </div>

            {/* Facilities grid */}
            <div>
              <h3 className="font-display font-bold uppercase text-sm tracking-wide text-foreground/70 mb-3">Facilities on site</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {facilities.map((f) => (
                  <div key={f.label} className="rounded-lg border border-border/60 bg-card/60 p-3 hover:border-accent/30 transition-colors">
                    <f.icon className="h-5 w-5 text-accent mb-1.5" />
                    <div className="text-xs font-semibold text-foreground leading-tight">{f.label}</div>
                    <div className="text-[10px] text-foreground/50 mt-0.5">{f.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
