import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
  href: string;
  label: string;
};

export default function NavItem({ href, label }: Props) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`text-sm font-medium transition
        ${isActive
          ? "text-yellow-500"
          : "text-gray-600 hover:text-gray-900"}
      `}
    >
      {label}
    </Link>
  );
}
