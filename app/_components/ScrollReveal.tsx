"use client";

import { useEffect, useRef, useState, ReactNode } from "react";

export function ScrollReveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
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
      { threshold: 0.1, rootMargin: "0px 0px -32px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={[
        "transition-[opacity,transform] duration-700 motion-reduce:transition-none",
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 motion-safe:translate-y-8",
        className,
      ].join(" ")}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
