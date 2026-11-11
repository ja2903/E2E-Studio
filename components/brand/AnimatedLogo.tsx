import { E2E_PATH, STUDIO_PATH } from "./logo-paths";

const MARK = "M14 86 C 44 86, 56 14, 86 14";

/**
 * The full E2E Studio logo, animated: the orange dot lights, the line draws to
 * the blue dot (which ripples), the wordmark wipes in, then a spark keeps
 * travelling start → end and a sheen passes over the letters.
 * All motion is CSS (see .logo-anim in globals.css). Base styles are the final
 * state, so with reduced motion it simply shows the finished logo.
 */
export default function AnimatedLogo({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 718.3 143.81"
      role="img"
      aria-label="E2E Studio"
      className={`logo-anim overflow-visible ${className}`}
    >
      <defs>
        <clipPath id="logo-wm">
          <path d={E2E_PATH} transform="translate(14 109.15)" />
          <path d={STUDIO_PATH} transform="translate(14 109.15)" />
        </clipPath>
        <linearGradient id="logo-sheen" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#bfe6ff" stopOpacity="0.9" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <filter id="logo-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
      </defs>

      {/* Flow mark */}
      <g transform="translate(6.1 6.1) scale(1.316)">
        <path d={MARK} pathLength={1} className="logo-line-glow" fill="none" stroke="#0297DE" strokeWidth="9" strokeLinecap="round" filter="url(#logo-glow)" />
        <path d={MARK} pathLength={1} className="logo-line" fill="none" stroke="#0297DE" strokeWidth="5" strokeLinecap="round" />
        <path d={MARK} pathLength={1} className="logo-spark" fill="none" stroke="#e6f6ff" strokeWidth="5" strokeLinecap="round" />
        <circle cx="14" cy="86" r="8" className="logo-ring logo-ring-start" fill="none" stroke="#FC734D" strokeWidth="2" />
        <circle cx="14" cy="86" r="8" className="logo-dot logo-dot-start" fill="#FC734D" />
        <circle cx="86" cy="14" r="8" className="logo-ring logo-ring-end" fill="none" stroke="#0297DE" strokeWidth="2" />
        <circle cx="86" cy="14" r="8" className="logo-dot logo-dot-end" fill="#0297DE" />
      </g>

      {/* Wordmark */}
      <g transform="translate(14 109.15)" fill="#F5F7F8">
        <path d={E2E_PATH} className="logo-word logo-word-1" />
        <path d={STUDIO_PATH} className="logo-word logo-word-2" />
      </g>
      <g clipPath="url(#logo-wm)">
        <rect x="120" y="0" width="140" height="144" fill="url(#logo-sheen)" className="logo-sheen" />
      </g>
    </svg>
  );
}
