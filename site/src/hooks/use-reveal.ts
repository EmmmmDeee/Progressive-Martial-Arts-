"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Reveal-on-scroll hook using IntersectionObserver.
 * Returns a ref to attach to an element and a boolean indicating visibility.
 *
 * Usage:
 *   const { ref, isVisible } = useReveal();
 *   <div ref={ref} className={`reveal ${isVisible ? "is-visible" : ""}`}>...</div>
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(options?: {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
}) {
  const { threshold = 0.15, rootMargin = "0px 0px -10% 0px", once = true } = options || {};
  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Respect reduced motion — defer setState via microtask to satisfy lint rule
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      queueMicrotask(() => setIsVisible(true));
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return { ref, isVisible };
}
