import Image from "next/image";

interface LogoProps {
  hideText?: boolean;
  hideTextOnMobile?: boolean;
  className?: string;
}

export function Logo({
  hideText = false,
  hideTextOnMobile = false,
  className = "",
}: LogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Image
        src="/images/logo.png"
        alt="News Reporter Logo"
        width={40}
        height={40}
        className="object-contain"
      />
      <span
        className={`font-abhaya text-base ${
          hideText ? "hidden" : hideTextOnMobile ? "md:block hidden" : "block"
        }`}
      >
        NCCRM DataHub
      </span>
    </div>
  );
}
