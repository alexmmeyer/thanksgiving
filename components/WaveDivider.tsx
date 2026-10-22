export function WaveDivider({
  className,
  flip = false,
}: {
  className?: string;
  flip?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 400 40"
      preserveAspectRatio="none"
      className={className}
      style={flip ? { transform: "scaleY(-1)" } : undefined}
      aria-hidden
    >
      <path
        d="M0 22 C 40 10, 80 32, 130 20 S 220 8, 270 22 S 360 34, 400 18 V40 H0Z"
        fill="#9ed9d6"
        opacity="0.75"
      />
      <path
        d="M0 28 C 50 18, 100 38, 160 27 S 250 16, 300 29 S 370 36, 400 26 V40 H0Z"
        fill="#3bb8c3"
        opacity="0.8"
      />
      <path
        d="M0 30 C 50 20, 100 40, 160 29 S 250 18, 300 31 S 370 38, 400 28"
        fill="none"
        stroke="#fbf6ea"
        strokeWidth="1.5"
        opacity="0.8"
      />
    </svg>
  );
}
