"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

type GalleryFile = { file: string; alt: string };

type Props = {
  files: GalleryFile[];
};

export default function GalleryLightbox({ files }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const close = useCallback(() => setOpenIndex(null), []);
  const prev = useCallback(
    () => setOpenIndex((i) => (i == null ? null : (i - 1 + files.length) % files.length)),
    [files.length],
  );
  const next = useCallback(
    () => setOpenIndex((i) => (i == null ? null : (i + 1) % files.length)),
    [files.length],
  );

  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [openIndex, close, prev, next]);

  if (files.length === 0) {
    return <p className="text-center text-[#6b5d4f] py-8">Gallery coming soon.</p>;
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {files.map(({ file, alt }, idx) => (
          <button
            key={file}
            type="button"
            onClick={() => setOpenIndex(idx)}
            aria-label={`Open ${alt} in lightbox`}
            className="group relative aspect-square overflow-hidden rounded-2xl bg-[#e9e3db] shadow-lg cursor-zoom-in focus-visible:outline-2 focus-visible:outline-[#7a2e3f] focus-visible:outline-offset-2"
            style={{ transitionDelay: `${(idx % 4) * 40}ms` }}
            data-reveal
          >
            <Image
              src={`/gallery/${file}`}
              alt={alt}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
            />
            <span className="absolute inset-0 bg-gradient-to-t from-[#3a322b]/60 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden="true" />
            <span className="absolute bottom-3 left-3 right-3 text-left text-white text-xs tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {alt}
            </span>
          </button>
        ))}
      </div>

      {openIndex !== null && (
        <div
          className="fixed inset-0 z-[100] bg-[#1f1a16]/95 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label="Gallery image"
        >
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); close(); }}
            aria-label="Close"
            className="absolute top-4 right-4 text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); prev(); }}
            aria-label="Previous image"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-3 rounded-full hover:bg-white/10 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); next(); }}
            aria-label="Next image"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-3 rounded-full hover:bg-white/10 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <div
            className="relative max-w-[min(96vw,1200px)] max-h-[88vh] w-full h-full flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-full">
              <Image
                src={`/gallery/${files[openIndex].file}`}
                alt={files[openIndex].alt}
                fill
                sizes="96vw"
                className="object-contain"
                priority
              />
            </div>
            <div className="mt-4 text-white/85 text-sm tracking-wider text-center">
              <span className="uppercase text-[10px] tracking-[0.3em] text-white/60 mr-3">
                {openIndex + 1} / {files.length}
              </span>
              {files[openIndex].alt}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
