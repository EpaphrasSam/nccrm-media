interface GhanaFlagGradientProps {
  className?: string;
}

export function GhanaFlagGradient({ className = "" }: GhanaFlagGradientProps) {
  return (
    <div
      className={`absolute inset-0 bg-ghana-flag-gradient ${className}`}
      aria-hidden="true"
    />
  );
}
