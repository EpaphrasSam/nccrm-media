interface PageHeadingProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export function PageHeading({
  title,
  subtitle,
  className = "",
}: PageHeadingProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <h1 className="text-title font-extrabold leading-117 text-brand-black">
        {title}
      </h1>
      {subtitle && (
        <p className="text-sm-plus font-extrabold leading-117 text-brand-gray">
          {subtitle}
        </p>
      )}
    </div>
  );
}
