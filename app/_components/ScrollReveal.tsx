"use client";

import { useEffect, useRef, useState, ReactNode } from "react";

const EASING = "cubic-bezier(0.16, 1, 0.3, 1)";

/**
 * mode="fade"  — opacity + translate-up (body text, cards, images)
 * mode="clip"  — translate-up from behind overflow:hidden parent (headlines)
 */
export function ScrollReveal({
  children,
  delay = 0,
  className = "",
  mode = "fade",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  mode?: "fade" | "clip";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.05, rootMargin: "0px 0px -16px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  if (mode === "clip") {
    return (
      <div ref={ref} className={["overflow-hidden", className].join(" ")}>
        <div
          style={{
            transform: visible ? "translateY(0)" : "translateY(110%)",
            transition: `transform 800ms ${EASING} ${delay}ms`,
          }}
          // prefers-reduced-motion: snap to visible without transform
          className="motion-reduce:!transform-none motion-reduce:!transition-none"
        >
          {children}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0px)" : "translateY(20px)",
        transition: `opacity 700ms ${EASING} ${delay}ms, transform 700ms ${EASING} ${delay}ms`,
      }}
      // prefers-reduced-motion: skip transform, keep opacity snap
      // (inline styles override Tailwind, so use data-attr or CSS-in-JS workaround)
    >
      {children}
    </div>
  );
}
