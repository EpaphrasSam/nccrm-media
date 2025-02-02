interface AdminPageHeaderProps {
  title: string;
  description?: string;
}

export function AdminPageHeader({ title, description }: AdminPageHeaderProps) {
  return (
    <div className="space-y-1">
      <h1 className="text-title font-extrabold leading-117 text-brand-black">
        {title}
      </h1>
      {description && (
        <p className="text-sm-plus font-extrabold leading-117 text-brand-gray">
          {description}
        </p>
      )}
    </div>
  );
}
