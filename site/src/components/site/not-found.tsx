import { Flame, ArrowLeft, Home as HomeIcon } from "lucide-react";
import { RouteLink } from "@/lib/router";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/site/breadcrumbs";

export function NotFoundPage() {
  return (
    <div className="pt-16 lg:pt-20 min-h-[70vh] flex items-center">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 text-center w-full">
        <Breadcrumbs items={[{ label: "Page not found" }]} className="justify-center mb-8" />
        <div className="relative inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 mb-6">
          <Flame className="h-10 w-10 text-primary" />
          <span className="absolute -bottom-2 -right-2 font-display text-xs font-bold bg-accent text-accent-foreground px-2 py-0.5 rounded">
            404
          </span>
        </div>
        <h1 className="font-display text-5xl sm:text-6xl font-bold uppercase">
          <span className="text-gradient-crimson">Lost</span> on the mat
        </h1>
        <p className="mt-4 text-foreground/70 max-w-md mx-auto">
          The page you&apos;re looking for doesn&apos;t exist — but your training
          journey is just getting started. Let&apos;s get you back on track.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <RouteLink to={{ name: "home" }}>
            <Button className="bg-primary hover:bg-primary/90 w-full sm:w-auto">
              <HomeIcon className="mr-2 h-4 w-4" />
              Back to home
            </Button>
          </RouteLink>
          <RouteLink to={{ name: "timetable" }}>
            <Button variant="outline" className="border-border w-full sm:w-auto">
              <ArrowLeft className="mr-2 h-4 w-4" />
              View timetable
            </Button>
          </RouteLink>
        </div>
      </div>
    </div>
  );
}
