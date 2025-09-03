"use client";

import { useEffect } from "react";

type Props = { url: string };

export default function InstagramEmbed({ url }: Props) {
  useEffect(() => {
    const scriptId = "instagram-embed-script";
    if (!document.getElementById(scriptId)) {
      const s = document.createElement("script");
      s.id = scriptId;
      s.async = true;
      s.src = "https://www.instagram.com/embed.js";
      document.body.appendChild(s);
    } else if ((window as typeof window & { instgrm?: { Embeds?: { process: () => void } } }).instgrm?.Embeds?.process) {
      (window as typeof window & { instgrm: { Embeds: { process: () => void } } }).instgrm.Embeds.process();
    }
  }, []);

  return (
    <div className="max-w-[540px] mx-auto">
      <blockquote
        className="instagram-media"
        data-instgrm-permalink={url}
        data-instgrm-version="14"
        style={{ background: "#FFF", border: 0, margin: "0 auto", maxWidth: 540, width: "100%" }}
      />
    </div>
  );
}


