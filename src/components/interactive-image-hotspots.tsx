import { useEffect, useRef, useState } from "react";

export type Hotspot = {
  id: string;
  title: string;
  description: string;
  /** percentages of container (0-100) */
  left: number;
  top: number;
  width: number;
  height: number;
  /** CSS color for border */
  color: string;
};

type Props = {
  imageSrc: string;
  imageAlt: string;
  hotspots: Hotspot[];
  sectionTitle?: string;
  sectionDescription?: string;
  sectionId?: string;
};

export function InteractiveImageHotspots({
  imageSrc,
  imageAlt,
  hotspots,
  sectionTitle,
  sectionDescription,
  sectionId,
}: Props) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Close on outside tap (mobile)
  useEffect(() => {
    function onDocPointer(e: PointerEvent) {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) {
        setActiveId(null);
      }
    }
    document.addEventListener("pointerdown", onDocPointer);
    return () => document.removeEventListener("pointerdown", onDocPointer);
  }, []);

  return (
    <section id={sectionId} className="mb-10">
      {sectionTitle && (
        <h3 className="serif text-2xl mb-2 text-ink">{sectionTitle}</h3>
      )}
      {sectionDescription && (
        <p className="text-sm text-muted-text mb-4">{sectionDescription}</p>
      )}
      <p className="text-xs text-muted-text mb-3">
        마우스를 올리거나 박스를 탭하면 설명이 나타납니다.
      </p>
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden rounded-lg border border-hairline bg-surface-soft"
      >
        <img
          src={imageSrc}
          alt={imageAlt}
          className="block w-full h-auto select-none"
          draggable={false}
        />
        {hotspots.map((h) => {
          const isActive = activeId === h.id;
          // Decide tooltip side to avoid overflow
          const centerX = h.left + h.width / 2;
          const placeAbove = h.top > 35;
          const placeLeft = centerX > 60;
          return (
            <button
              key={h.id}
              type="button"
              aria-label={h.title}
              onMouseEnter={() => setActiveId(h.id)}
              onMouseLeave={() => setActiveId((cur) => (cur === h.id ? null : cur))}
              onFocus={() => setActiveId(h.id)}
              onBlur={() => setActiveId((cur) => (cur === h.id ? null : cur))}
              onClick={(e) => {
                e.stopPropagation();
                setActiveId((cur) => (cur === h.id ? null : h.id));
              }}
              className="absolute group focus:outline-none"
              style={{
                left: `${h.left}%`,
                top: `${h.top}%`,
                width: `${h.width}%`,
                height: `${h.height}%`,
              }}
            >
              <span
                className="absolute inset-0 rounded-md transition-all"
                style={{
                  border: `${isActive ? 3 : 2}px solid ${h.color}`,
                  backgroundColor: isActive
                    ? `color-mix(in oklab, ${h.color} 14%, transparent)`
                    : "transparent",
                  boxShadow: isActive
                    ? `0 0 0 2px color-mix(in oklab, ${h.color} 25%, transparent)`
                    : "none",
                }}
              />
              {isActive && (
                <span
                  role="tooltip"
                  className="absolute z-10 w-56 sm:w-64 rounded-md bg-white shadow-lg ring-1 ring-black/5 p-3 text-left animate-in fade-in-0 zoom-in-95"
                  style={{
                    [placeAbove ? "bottom" : "top"]: "calc(100% + 8px)",
                    [placeLeft ? "right" : "left"]: "0",
                  } as React.CSSProperties}
                >
                  <span
                    className="block text-[11px] font-semibold uppercase tracking-wider mb-1"
                    style={{ color: h.color }}
                  >
                    {h.title}
                  </span>
                  <span className="block text-sm text-ink leading-relaxed">
                    {h.description}
                  </span>
                </span>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
