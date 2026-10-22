export function Compass({ size = 40, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={className}
      aria-hidden
    >
      <circle cx="32" cy="32" r="14" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <path d="M32 4 36 28 32 32 28 28Z" fill="currentColor" />
      <path d="M32 60 28 36 32 32 36 36Z" fill="currentColor" opacity="0.85" />
      <path d="M60 32 36 36 32 32 36 28Z" fill="currentColor" opacity="0.85" />
      <path d="M4 32 28 28 32 32 28 36Z" fill="currentColor" opacity="0.85" />
      <path d="M32 4 28 28 32 32Z" fill="#fbf6ea" opacity="0.55" />
      <path d="M48 16 35 30 32 32 34 29Z" fill="currentColor" opacity="0.5" />
      <path d="M16 48 29 34 32 32 30 35Z" fill="currentColor" opacity="0.5" />
      <path d="M48 48 34 35 32 32 35 34Z" fill="currentColor" opacity="0.5" />
      <path d="M16 16 30 29 32 32 29 30Z" fill="currentColor" opacity="0.5" />
    </svg>
  );
}
