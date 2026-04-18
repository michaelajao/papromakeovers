"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    instgrm?: {
      Embeds: {
        process: () => void;
      };
    };
  }
}

const EMBED_SCRIPT_SRC = "https://www.instagram.com/embed.js";

type Variant = "grid" | "featured";

type Props = {
  urls: string[];
  /**
   * `grid` — multi-tile responsive grid, used inside a larger Gallery-style block.
   *          Caller owns the section/heading; this only renders the grid.
   * `featured` — single centered, larger embed with its own section + heading.
   */
  variant?: Variant;
  /** Overall heading, only used when variant === "featured". */
  title?: string;
  /** Eyebrow label above the heading, only used when variant === "featured". */
  eyebrow?: string;
};

export default function InstagramEmbeds({
  urls,
  variant = "grid",
  title,
  eyebrow,
}: Props) {
  useEffect(() => {
    // Re-scan the DOM if embed.js already loaded (nav / hot-reload / new embeds).
    if (typeof window !== "undefined" && window.instgrm) {
      window.instgrm.Embeds.process();
      return;
    }
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${EMBED_SCRIPT_SRC}"]`,
    );
    if (existing) return;
    const script = document.createElement("script");
    script.src = EMBED_SCRIPT_SRC;
    script.async = true;
    document.body.appendChild(script);
  }, [urls]);

  if (!urls || urls.length === 0) return null;

  if (variant === "featured") {
    return (
      <section id="featured-reel" className="py-24 bg-[#f5f2ed]">
        <div className="max-w-[1200px] mx-auto px-5">
          <div className="text-center mb-12" data-reveal>
            {eyebrow && (
              <div className="text-xs uppercase tracking-[0.3em] text-[#b49b82] mb-4">
                {eyebrow}
              </div>
            )}
            <h2 className="font-serif text-4xl sm:text-5xl text-[#3a322b] mb-6 font-normal">
              {title ?? "Featured"}
            </h2>
            <div className="w-12 h-px bg-[#d4b896] mx-auto" aria-hidden="true" />
          </div>

          <div className="flex justify-center" data-reveal>
            {urls.slice(0, 1).map((url) => (
              <div key={url} className="w-full max-w-[420px]">
                {renderBlockquote(url)}
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // variant === "grid"
  return (
    <div
      className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 items-start justify-items-center"
      data-reveal
    >
      {urls.map((url, idx) => (
        <div
          key={url}
          className="w-full max-w-[328px]"
          style={{ transitionDelay: `${idx * 60}ms` }}
        >
          {renderBlockquote(url)}
        </div>
      ))}
    </div>
  );
}

function renderBlockquote(url: string) {
  return (
    <blockquote
      className="instagram-media"
      data-instgrm-permalink={url}
      data-instgrm-version="14"
      style={{
        background: "#FFF",
        border: 0,
        borderRadius: 3,
        boxShadow:
          "0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15)",
        margin: 0,
        maxWidth: 540,
        width: "100%",
        padding: 0,
      }}
    >
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        style={{ padding: "16px", display: "block" }}
      >
        View on Instagram
      </a>
    </blockquote>
  );
}
