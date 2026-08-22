"use client";

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";

// ---------- Types ----------
// Route shapes. Everything is client-side within the single `/` page route.
// Examples:
//   { name: "home" }                              -> home page
//   { name: "program", slug: "muay-thai" }        -> program detail
//   { name: "instructor", slug: "sifu-costa-vassiliou" }
//   { name: "event", slug: "inosanto-2026" }
//   { name: "shop" }                              -> shop index
//   { name: "product", slug: "..." }
//   { name: "cart" }
//   { name: "checkout" }
//   { name: "timetable" }
//   { name: "instructors" }
//   { name: "events" }
//   { name: "about" }
//   { name: "contact" }
//   { name: "not-found" }

export type Route =
  | { name: "home" }
  | { name: "program"; slug: string }
  | { name: "instructor"; slug: string }
  | { name: "event"; slug: string }
  | { name: "shop" }
  | { name: "product"; slug: string }
  | { name: "cart" }
  | { name: "checkout" }
  | { name: "order-success"; id: string }
  | { name: "timetable" }
  | { name: "instructors" }
  | { name: "events" }
  | { name: "gallery" }
  | { name: "about" }
  | { name: "history" }
  | { name: "contact" }
  | { name: "kids" }
  | { name: "blog" }
  | { name: "article"; slug: string }
  | { name: "not-found" };

type RouterCtx = {
  route: Route;
  navigate: (route: Route) => void;
  back: () => void;
};

const Ctx = createContext<RouterCtx | null>(null);

// ---------- Route <-> hash ----------
function routeToHash(r: Route): string {
  if (r.name === "home") return "#/";
  if (r.name === "not-found") return "#/404";
  if ("slug" in r) return `#/${r.name}/${r.slug}`;
  if ("id" in r) return `#/${r.name}/${r.id}`;
  return `#/${r.name}`;
}

function hashToRoute(hash: string): Route {
  const h = hash.replace(/^#\/?/, "");
  if (!h || h === "" ) return { name: "home" };
  if (h === "404") return { name: "not-found" };
  const parts = h.split("/");
  const [name, slug] = parts;
  switch (name) {
    case "program":
    case "instructor":
    case "event":
    case "product":
    case "article":
      return slug ? ({ name, slug } as Route) : { name: "not-found" };
    case "order-success":
      return slug ? { name: "order-success", id: slug } : { name: "not-found" };
    case "shop":
    case "cart":
    case "checkout":
    case "timetable":
    case "instructors":
    case "events":
    case "gallery":
    case "about":
    case "history":
    case "contact":
    case "kids":
    case "blog":
      return { name } as Route;
    default:
      return { name: "not-found" };
  }
}

export function RouterProvider({ children }: { children: ReactNode }) {
  const [route, setRoute] = useState<Route>(() =>
    hashToRoute(typeof window !== "undefined" ? window.location.hash : "")
  );
  const [history, setHistory] = useState<Route[]>([]);

  useEffect(() => {
    const onHash = () => setRoute(hashToRoute(window.location.hash));
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const navigate = useCallback(
    (next: Route) => {
      setHistory((h) => [...h, route]);
      const hash = routeToHash(next);
      if (window.location.hash !== hash) {
        window.location.hash = hash;
      } else {
        setRoute(next);
      }
      // scroll to top on navigation
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    },
    [route]
  );

  const back = useCallback(() => {
    setHistory((h) => {
      if (h.length === 0) {
        navigate({ name: "home" });
        return h;
      }
      const prev = h[h.length - 1];
      const hash = routeToHash(prev);
      window.location.hash = hash;
      return h.slice(0, -1);
    });
  }, [navigate]);

  return <Ctx.Provider value={{ route, navigate, back }}>{children}</Ctx.Provider>;
}

export function useRouter() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useRouter must be used within RouterProvider");
  return ctx;
}

// Helper hook for a slug param
export function useRouteSlug(): string | undefined {
  const { route } = useRouter();
  if ("slug" in route) return route.slug;
  return undefined;
}

// Convenience link component
export function RouteLink({
  to,
  className,
  children,
  onClick,
  ...rest
}: {
  to: Route;
  className?: string;
  children: ReactNode;
  onClick?: () => void;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "onClick">) {
  const { navigate } = useRouter();
  return (
    <a
      href={routeToHash(to)}
      className={className}
      onClick={(e) => {
        e.preventDefault();
        navigate(to);
        onClick?.();
      }}
      {...rest}
    >
      {children}
    </a>
  );
}
