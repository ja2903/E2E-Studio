"use client";

import Image from "next/image";
import { useRef } from "react";
import type { Visual } from "@/lib/packages";

/**
 * A thumbnail that opens the full image in a native <dialog> (Esc, backdrop click or the button closes it).
 * The dialog also links to the raw file, so phones can pinch-zoom the small text.
 */
export default function ImageZoom({ image, label, sizes }: { image: Visual; label: string; sizes: string }) {
  const ref = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button type="button" className="zoom-thumb" onClick={() => ref.current?.showModal()} aria-label={`${label}: open full size`}>
        <Image src={image.src} alt={image.alt} width={image.width} height={image.height} sizes={sizes} className="h-auto w-full" />
        <span aria-hidden="true" className="zoom-hint">
          <svg viewBox="0 0 20 20" className="size-4">
            <path d="M12 3h5v5M8 17H3v-5M17 3l-6 6M3 17l6-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Full size
        </span>
      </button>

      <dialog
        ref={ref}
        className="zoom-dialog"
        aria-label={label}
        data-lenis-prevent
        onClick={(e) => e.target === e.currentTarget && ref.current?.close()}
      >
        <div className="zoom-bar">
          <a href={image.src} target="_blank" rel="noopener" className="link-quiet text-sm">
            Open image in a new tab
          </a>
          <button type="button" className="pkg-arrow" aria-label="Close" onClick={() => ref.current?.close()}>
            <svg aria-hidden="true" viewBox="0 0 20 20" className="size-5">
              <path d="M5 5l10 10M15 5L5 15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <Image src={image.src} alt={image.alt} width={image.width} height={image.height} sizes="100vw" className="zoom-full" />
      </dialog>
    </>
  );
}
