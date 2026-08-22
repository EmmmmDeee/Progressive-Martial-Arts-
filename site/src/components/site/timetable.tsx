"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Clock,
  MapPin,
  User,
  CalendarDays,
  Sparkles,
  Users,
  Dumbbell,
  ListFilter,
  LayoutGrid,
  CalendarCheck,
} from "lucide-react";
import type { ClassScheduleT } from "@/lib/data";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ---------------------------------------------------------------------------
// Constants & helpers
// ---------------------------------------------------------------------------

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as const;

// Map JS getDay() (0=Sunday .. 6=Saturday) to a day name we use in the DB.
const JS_DAY_TO_NAME: Record<number, string> = {
  0: "Sunday",
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
};

const DAY_SHORT: Record<string, string> = {
  Monday: "Mon",
  Tuesday: "Tue",
  Wednesday: "Wed",
  Thursday: "Thu",
  Friday: "Fri",
  Saturday: "Sat",
  Sunday: "Sun",
};

type ViewMode = "today" | "week" | "discipline" | "adults" | "kids";

const VIEW_TABS: {
  id: ViewMode;
  label: string;
  short: string;
  icon: typeof LayoutGrid;
}[] = [
  { id: "today", label: "Today", short: "Today", icon: CalendarCheck },
  { id: "week", label: "Full Week", short: "Week", icon: LayoutGrid },
  { id: "discipline", label: "By Discipline", short: "Discipline", icon: ListFilter },
  { id: "adults", label: "Adults", short: "Adults", icon: Users },
  { id: "kids", label: "Kids", short: "Kids", icon: Sparkles },
];

// Level badge styling — keeps the dark + crimson + gold aesthetic.
const LEVEL_STYLE: Record<string, string> = {
  "All Levels": "bg-secondary/70 text-foreground border-border",
  Beginner: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  Advanced: "bg-primary/15 text-primary border-primary/30",
  Kids: "bg-pink-500/15 text-pink-400 border-pink-500/30",
};

function levelClass(level: string): string {
  return LEVEL_STYLE[level] || LEVEL_STYLE["All Levels"];
}

// Per-discipline left-edge stripe color. Stays within the warm / crimson / gold
// palette the brand uses, plus a few accent hues for variety. No pure blue.
const ART_STRIPE: Record<string, string> = {
  "Muay Thai": "bg-red-500",
  "Muay Thai Sparring": "bg-red-700",
  "Brazilian Jiu Jitsu": "bg-emerald-500",
  "Kali": "bg-amber-500",
  "Jeet Kune Do": "bg-yellow-400",
  "Maphilindo Silat": "bg-teal-500",
  "Jun Fan Gung Fu": "bg-pink-500",
  "Mini Muscles": "bg-rose-400",
  "Progressive Strength": "bg-orange-500",
  "Strength Circuit": "bg-orange-400",
  "Kali & Silat": "bg-lime-500",
};

function stripeFor(artName: string): string {
  return ART_STRIPE[artName] || "bg-primary/60";
}

// 12-hour formatting ("18:00" -> "6:00 PM") for friendlier display.
function prettyTime(t: string): string {
  const [hStr, mStr] = t.split(":");
  const h = parseInt(hStr, 10);
  if (Number.isNaN(h)) return t;
  const m = mStr || "00";
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${m} ${period}`;
}

// Sort: day order first, then start time ascending.
function byDayThenTime<T extends { day: string; startTime: string }>(a: T, b: T): number {
  const da = DAYS.indexOf(a.day as (typeof DAYS)[number]);
  const db = DAYS.indexOf(b.day as (typeof DAYS)[number]);
  const dDiff = (da === -1 ? 99 : da) - (db === -1 ? 99 : db);
  if (dDiff !== 0) return dDiff;
  return a.startTime.localeCompare(b.startTime);
}

// ---------------------------------------------------------------------------
// Class card
// ---------------------------------------------------------------------------

function ClassCard({
  c,
  showDay = false,
}: {
  c: ClassScheduleT;
  showDay?: boolean;
}) {
  return (
    <article
      className="group relative rounded-xl bg-card border border-border/60 p-5 pl-6 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all"
    >
      {/* Left-edge color stripe per art */}
      <div
        aria-hidden
        className={`absolute left-0 top-5 bottom-5 w-1 rounded-r ${stripeFor(c.artName)} opacity-70 group-hover:opacity-100 transition-opacity`}
      />

      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
            <Clock className="h-3.5 w-3.5 text-accent shrink-0" />
            <span className="tabular-nums">
              {prettyTime(c.startTime)} – {prettyTime(c.endTime)}
            </span>
          </div>
          <h3 className="mt-1 font-display text-lg font-bold uppercase text-foreground leading-tight tracking-wide">
            {c.artName}
          </h3>
        </div>
        <span
          className={`shrink-0 text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded border ${levelClass(c.level)}`}
        >
          {c.level}
        </span>
      </div>

      <div className="space-y-1.5 text-xs text-foreground/65">
        <div className="flex items-center gap-1.5">
          <User className="h-3.5 w-3.5 text-accent/80 shrink-0" />
          <span className="truncate">{c.instructor}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 text-accent/80 shrink-0" />
          <span className="truncate">{c.room}</span>
        </div>
        {showDay && (
          <div className="flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5 text-accent/80 shrink-0" />
            <span>{c.day}</span>
          </div>
        )}
      </div>

      {c.notes ? (
        <p className="mt-3 pt-3 border-t border-border/40 text-[11px] text-foreground/50 leading-relaxed">
          {c.notes}
        </p>
      ) : null}
    </article>
  );
}

// ---------------------------------------------------------------------------
// Empty state
// ---------------------------------------------------------------------------

function EmptyState({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  return (
    <div className="rounded-xl border border-dashed border-border p-10 sm:p-14 text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-secondary/60">
        <CalendarDays className="h-6 w-6 text-accent/70" />
      </div>
      <p className="font-display text-lg font-bold uppercase text-foreground/80">{title}</p>
      <p className="mt-2 text-sm text-foreground/55 max-w-md mx-auto">{message}</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Loading skeleton
// ---------------------------------------------------------------------------

function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="h-36 rounded-xl" />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function Timetable() {
  const [classes, setClasses] = useState<ClassScheduleT[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<ViewMode>("today");
  const [disciplineFilter, setDisciplineFilter] = useState<string>("all");
  // `now` is captured once, lazily, on the client. Using a lazy initializer
  // (rather than setState-in-effect) avoids cascading renders and lint errors.
  // On the server (SSR) the date is captured at render time; on the client it
  // is captured at first render — both produce the same weekday/date in
  // practice, so no hydration mismatch.
  const [now] = useState<Date>(() => new Date());
  // Default the mobile "Full Week" day picker to today (or Monday as fallback).
  const [mobileDay, setMobileDay] = useState<string>(
    () => JS_DAY_TO_NAME[new Date().getDay()] || "Monday"
  );

  // Fetch classes on mount only.
  useEffect(() => {
    let cancelled = false;
    fetch("/api/classes")
      .then((r) => r.json())
      .then((res) => {
        if (cancelled) return;
        if (res?.ok) setClasses(res.data || []);
      })
      .catch(() => {
        /* swallow — UI shows empty state */
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Today's name (e.g. "Wednesday") and long form ("Wednesday, 14 August").
  const todayName = useMemo(
    () => JS_DAY_TO_NAME[now.getDay()] || "",
    [now]
  );

  const todayLongDate = useMemo(
    () =>
      now.toLocaleDateString("en-AU", {
        weekday: "long",
        day: "numeric",
        month: "long",
      }),
    [now]
  );

  const todayWeekdayOnly = useMemo(
    () => now.toLocaleDateString("en-AU", { weekday: "long" }),
    [now]
  );

  // Disciplines available in the data, sorted alphabetically for the Select.
  const disciplines = useMemo(() => {
    const set = new Set<string>();
    classes.forEach((c) => set.add(c.artName));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [classes]);

  // --- Per-view derived data ---

  const todaysClasses = useMemo(() => {
    if (!todayName) return [];
    return classes
      .filter((c) => c.day === todayName)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [classes, todayName]);

  const disciplineClasses = useMemo(() => {
    const list =
      disciplineFilter === "all"
        ? classes
        : classes.filter((c) => c.artName === disciplineFilter);
    return [...list].sort(byDayThenTime);
  }, [classes, disciplineFilter]);

  const adultsClasses = useMemo(
    () => classes.filter((c) => c.level !== "Kids").sort(byDayThenTime),
    [classes]
  );

  const kidsClasses = useMemo(
    () => classes.filter((c) => c.level === "Kids").sort(byDayThenTime),
    [classes]
  );

  // Classes per day for the Full Week grid (mobile single-day + desktop columns).
  const classesByDay = useMemo(() => {
    const map: Record<string, ClassScheduleT[]> = {};
    for (const d of DAYS) map[d] = [];
    for (const c of classes) {
      if (map[c.day]) map[c.day].push(c);
    }
    for (const d of DAYS) {
      map[d].sort((a, b) => a.startTime.localeCompare(b.startTime));
    }
    return map;
  }, [classes]);

  // Count per day — used in the day-tab badges.
  const countByDay = useMemo(() => {
    const map: Record<string, number> = {};
    for (const d of DAYS) map[d] = 0;
    for (const c of classes) {
      if (map[c.day] !== undefined) map[c.day] += 1;
    }
    return map;
  }, [classes]);

  // Group a flat class list by day (for Adults / Kids / Discipline views).
  const groupByDay = (list: ClassScheduleT[]) => {
    const map: Record<string, ClassScheduleT[]> = {};
    for (const d of DAYS) map[d] = [];
    for (const c of list) {
      if (map[c.day]) map[c.day].push(c);
    }
    return map;
  };

  // Keyboard navigation for the segmented view switcher (roving tabindex).
  const onTabKeyDown = (e: React.KeyboardEvent, current: ViewMode) => {
    const idx = VIEW_TABS.findIndex((t) => t.id === current);
    let nextIdx: number | null = null;
    if (e.key === "ArrowRight") nextIdx = (idx + 1) % VIEW_TABS.length;
    else if (e.key === "ArrowLeft")
      nextIdx = (idx - 1 + VIEW_TABS.length) % VIEW_TABS.length;
    else if (e.key === "Home") nextIdx = 0;
    else if (e.key === "End") nextIdx = VIEW_TABS.length - 1;
    if (nextIdx === null) return;
    e.preventDefault();
    const next = VIEW_TABS[nextIdx];
    setView(next.id);
    // Move focus to the newly active tab.
    requestAnimationFrame(() => {
      document.getElementById(`tab-${next.id}`)?.focus();
    });
  };

  const isToday = (day: string) => day === todayName;

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  return (
    <section
      id="timetable"
      className="relative py-20 lg:py-28 bg-secondary/30"
      aria-labelledby="timetable-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="animate-fade-up">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-primary">
                <span className="h-px w-8 bg-primary" />
                Weekly Timetable
              </div>
              <h2
                id="timetable-heading"
                className="mt-4 font-display text-4xl sm:text-5xl font-bold uppercase leading-tight"
              >
                Find your <span className="text-gradient-gold">training time</span>
              </h2>
              <p className="mt-3 text-sm text-foreground/55 max-w-xl">
                Six days of classes across every discipline we teach. Switch views to
                see what&apos;s on today, plan your week, or filter by art and level.
              </p>
            </div>

            {now && (
              <div className="flex items-center gap-2 text-sm text-foreground/60">
                <CalendarDays className="h-4 w-4 text-accent" />
                Today is{" "}
                <span className="text-foreground font-medium">{todayWeekdayOnly}</span>
              </div>
            )}
          </div>

          {/* View switcher (segmented, prominent) */}
          <div
            role="tablist"
            aria-label="Timetable view"
            aria-orientation="horizontal"
            className="flex w-full overflow-x-auto rounded-xl border border-border bg-card p-1.5 mb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {VIEW_TABS.map((t) => {
              const isActive = view === t.id;
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  id={`tab-${t.id}`}
                  role="tab"
                  type="button"
                  aria-selected={isActive}
                  aria-controls="panel-timetable"
                  tabIndex={isActive ? 0 : -1}
                  onKeyDown={(e) => onTabKeyDown(e, t.id)}
                  onClick={() => setView(t.id)}
                  className={`relative flex-1 min-w-[110px] flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                      : "text-foreground/70 hover:text-foreground hover:bg-secondary/60"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="hidden sm:inline">{t.label}</span>
                  <span className="sm:hidden">{t.short}</span>
                </button>
              );
            })}
          </div>

          {/* Panel content */}
          <div
            id="panel-timetable"
            role="tabpanel"
            aria-labelledby={`tab-${view}`}
            className="mt-8"
          >
            {loading ? (
              <SkeletonGrid count={6} />
            ) : (
              <>
                {/* ---------- Today ---------- */}
                {view === "today" && (
                  <div className="animate-fade-up">
                    {/* Today hero */}
                    <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 sm:p-8 mb-8">
                      <div
                        aria-hidden
                        className="absolute inset-0 bg-grain opacity-40 pointer-events-none"
                      />
                      <div className="relative flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                        <div>
                          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-accent">
                            <span className="relative flex h-2 w-2">
                              <span className="absolute inline-flex h-full w-full rounded-full bg-accent opacity-60 animate-ping" />
                              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
                            </span>
                            Live today
                          </div>
                          <p className="mt-3 font-display text-3xl sm:text-4xl font-bold uppercase leading-tight">
                            Today is <span className="text-gradient-gold">{todayLongDate}</span>
                          </p>
                          <p className="mt-2 text-sm text-foreground/60">
                            {todaysClasses.length === 0
                              ? "No scheduled classes today — the academy is closed."
                              : todaysClasses.length === 1
                                ? "1 class scheduled today."
                                : `${todaysClasses.length} classes scheduled today.`}
                          </p>
                        </div>
                        {todaysClasses.length > 0 && (
                          <button
                            type="button"
                            onClick={() => setView("week")}
                            className="inline-flex items-center gap-2 self-start rounded-lg border border-accent/30 bg-accent/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-accent hover:bg-accent/20 transition-colors"
                          >
                            <LayoutGrid className="h-3.5 w-3.5" />
                            View full week
                          </button>
                        )}
                      </div>
                    </div>

                    {todaysClasses.length === 0 ? (
                      <EmptyState
                        title="Academy closed today"
                        message="No classes are scheduled for today. Browse the Full Week view to plan your next session, or contact us about private coaching."
                      />
                    ) : (
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {todaysClasses.map((c) => (
                          <ClassCard key={c.id} c={c} />
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* ---------- Full Week ---------- */}
                {view === "week" && (
                  <div className="animate-fade-up">
                    {/* Mobile: day-tab picker + single-column list */}
                    <div className="sm:hidden mb-6">
                      <div
                        role="tablist"
                        aria-label="Day selector"
                        className="flex gap-1 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                      >
                        {DAYS.map((d) => {
                          const isActive = mobileDay === d;
                          const cnt = countByDay[d];
                          const today = isToday(d);
                          return (
                            <button
                              key={d}
                              type="button"
                              role="tab"
                              aria-selected={isActive}
                              onClick={() => setMobileDay(d)}
                              className={`relative shrink-0 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all border ${
                                isActive
                                  ? "bg-primary text-primary-foreground border-primary"
                                  : "bg-card border-border text-foreground/70 hover:border-primary/40 hover:text-foreground"
                              }`}
                            >
                              {DAY_SHORT[d]}
                              <span
                                className={`ml-1.5 text-[10px] ${isActive ? "text-primary-foreground/70" : "text-foreground/40"}`}
                              >
                                {cnt}
                              </span>
                              {today && !isActive && (
                                <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-accent ring-2 ring-background" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {/* Mobile single-day class list */}
                      {classesByDay[mobileDay]?.length ? (
                        <div className="grid gap-3">
                          {classesByDay[mobileDay].map((c) => (
                            <ClassCard key={c.id} c={c} />
                          ))}
                        </div>
                      ) : (
                        <EmptyState
                          title={`No classes on ${mobileDay}`}
                          message="Try another day from the tabs above — we run classes six days a week."
                        />
                      )}
                    </div>

                    {/* Desktop: 6-column grid */}
                    <div className="hidden sm:grid sm:grid-cols-3 lg:grid-cols-6 gap-3 items-start">
                      {DAYS.map((d) => {
                        const cnt = countByDay[d];
                        const today = isToday(d);
                        return (
                          <div
                            key={d}
                            className={`rounded-xl border bg-card/40 p-3 flex flex-col gap-3 ${
                              today ? "border-accent/40 shadow-lg shadow-accent/5" : "border-border/50"
                            }`}
                          >
                            <div className="flex items-center justify-between px-1">
                              <div className="flex items-center gap-2">
                                <h3 className="font-display text-sm font-bold uppercase tracking-wide text-foreground">
                                  {DAY_SHORT[d]}
                                </h3>
                                {today && (
                                  <span
                                    aria-label="Today"
                                    title="Today"
                                    className="h-1.5 w-1.5 rounded-full bg-accent"
                                  />
                                )}
                              </div>
                              <span className="text-[10px] font-semibold text-foreground/40">
                                {cnt}
                              </span>
                            </div>

                            <div className="flex flex-col gap-2">
                              {cnt === 0 ? (
                                <div className="rounded-lg border border-dashed border-border/40 p-3 text-center text-[11px] text-foreground/30">
                                  —
                                </div>
                              ) : (
                                classesByDay[d].map((c) => (
                                  <CompactClassCard key={c.id} c={c} />
                                ))
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* ---------- By Discipline ---------- */}
                {view === "discipline" && (
                  <div className="animate-fade-up">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                      <div>
                        <h3 className="font-display text-xl font-bold uppercase text-foreground">
                          Filter by discipline
                        </h3>
                        <p className="text-sm text-foreground/55 mt-1">
                          {disciplineFilter === "all"
                            ? `Showing all ${disciplineClasses.length} classes across ${disciplines.length} disciplines.`
                            : `${disciplineClasses.length} ${disciplineFilter} class${disciplineClasses.length === 1 ? "" : "es"} this week.`}
                        </p>
                      </div>
                      <Select
                        value={disciplineFilter}
                        onValueChange={(v) => setDisciplineFilter(v)}
                      >
                        <SelectTrigger
                          aria-label="Select discipline"
                          className="w-full sm:w-64 bg-card"
                        >
                          <SelectValue placeholder="Pick a discipline" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Disciplines</SelectItem>
                          {disciplines.map((d) => (
                            <SelectItem key={d} value={d}>
                              {d}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {disciplineClasses.length === 0 ? (
                      <EmptyState
                        title="No matching classes"
                        message="Try a different discipline — we have 11 arts and programs on the schedule."
                      />
                    ) : (
                      <DayGroupedClassList list={disciplineClasses} groupByDay={groupByDay} />
                    )}
                  </div>
                )}

                {/* ---------- Adults ---------- */}
                {view === "adults" && (
                  <div className="animate-fade-up">
                    <div className="rounded-xl border border-primary/20 bg-primary/5 p-5 mb-6 flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/15">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-display text-xl font-bold uppercase text-foreground">
                          Adults classes
                        </h3>
                        <p className="text-sm text-foreground/60 mt-1">
                          {adultsClasses.length} classes for adults and teens (13+) across
                          all levels — Beginner, All Levels, and Advanced.
                        </p>
                      </div>
                    </div>

                    {adultsClasses.length === 0 ? (
                      <EmptyState
                        title="No adult classes found"
                        message="Check back soon — the schedule is updated each term."
                      />
                    ) : (
                      <DayGroupedClassList list={adultsClasses} groupByDay={groupByDay} />
                    )}
                  </div>
                )}

                {/* ---------- Kids ---------- */}
                {view === "kids" && (
                  <div className="animate-fade-up">
                    <div className="rounded-xl border border-pink-500/20 bg-pink-500/5 p-5 mb-6 flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-pink-500/15">
                        <Dumbbell className="h-5 w-5 text-pink-400" />
                      </div>
                      <div>
                        <h3 className="font-display text-xl font-bold uppercase text-foreground">
                          Mini Muscles — Kids classes
                        </h3>
                        <p className="text-sm text-foreground/60 mt-1">
                          {kidsClasses.length} kids classes each week. Build coordination,
                          confidence and discipline in a fun, safe environment.
                        </p>
                      </div>
                    </div>

                    {kidsClasses.length === 0 ? (
                      <EmptyState
                        title="No kids classes found"
                        message="Kids classes (Mini Muscles) run during school terms — check back soon."
                      />
                    ) : (
                      <DayGroupedClassList list={kidsClasses} groupByDay={groupByDay} />
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer note */}
          <div className="mt-10 rounded-lg border border-accent/20 bg-accent/5 p-4 text-sm text-foreground/70 flex items-start gap-3">
            <CalendarDays className="h-5 w-5 text-accent shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-foreground">Walk-ins welcome.</span>{" "}
              First class is free — arrive 15 minutes early.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Compact card variant — used inside the Full Week desktop grid columns.
// ---------------------------------------------------------------------------

function CompactClassCard({ c }: { c: ClassScheduleT }) {
  return (
    <article
      className={`group relative rounded-lg bg-card border border-border/60 p-3 pl-4 hover:border-primary/40 hover:shadow-md hover:shadow-primary/5 transition-all`}
    >
      <div
        aria-hidden
        className={`absolute left-0 top-3 bottom-3 w-1 rounded-r ${stripeFor(c.artName)} opacity-70 group-hover:opacity-100 transition-opacity`}
      />
      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-foreground tabular-nums">
        <Clock className="h-3 w-3 text-accent shrink-0" />
        {prettyTime(c.startTime)}
      </div>
      <h4 className="mt-1 font-display text-xs font-bold uppercase text-foreground leading-tight line-clamp-2">
        {c.artName}
      </h4>
      <div className="mt-1.5 flex items-center gap-1 text-[10px] text-foreground/55">
        <span
          className={`inline-block px-1.5 py-0.5 rounded border ${levelClass(c.level)}`}
        >
          {c.level}
        </span>
      </div>
      <div className="mt-1.5 flex items-center gap-1 text-[10px] text-foreground/50">
        <User className="h-2.5 w-2.5 shrink-0" />
        <span className="truncate">{c.instructor}</span>
      </div>
    </article>
  );
}

// ---------------------------------------------------------------------------
// Day-grouped class list — used by Discipline / Adults / Kids views.
// Renders each non-empty day as a labelled grid of cards.
// ---------------------------------------------------------------------------

function DayGroupedClassList({
  list,
  groupByDay,
}: {
  list: ClassScheduleT[];
  groupByDay: (l: ClassScheduleT[]) => Record<string, ClassScheduleT[]>;
}) {
  const grouped = groupByDay(list);
  const used = DAYS.filter((d) => grouped[d].length > 0);

  if (used.length === 0) {
    return (
      <EmptyState
        title="Nothing scheduled"
        message="No classes match this view right now."
      />
    );
  }

  return (
    <div className="space-y-8">
      {used.map((d) => (
        <div key={d}>
          <div className="flex items-center gap-3 mb-4">
            <h4 className="font-display text-lg font-bold uppercase text-foreground">
              {d}
            </h4>
            <span className="text-xs font-semibold text-foreground/40">
              {grouped[d].length} class{grouped[d].length === 1 ? "" : "es"}
            </span>
            <div className="h-px flex-1 bg-border/40" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {grouped[d].map((c) => (
              <ClassCard key={c.id} c={c} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
