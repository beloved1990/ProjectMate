import Image from "next/image";
import Link from "next/link";

interface ProjectMateLogoProps {
  size?: number;
  showName?: boolean;
  className?: string;
}

export default function ProjectMateLogo({
  size = 48,
  showName = true,
  className = "",
}: ProjectMateLogoProps) {
  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-3 ${className}`}
    >
      <Image
        src="/projectmate-icon-192.png"
        alt="ProjectMate logo"
        width={size}
        height={size}
        priority
        className="object-contain"
      />

      {showName && (
        <span className="text-xl font-extrabold tracking-tight text-slate-900">
          ProjectMate
        </span>
      )}
    </Link>
  );
}