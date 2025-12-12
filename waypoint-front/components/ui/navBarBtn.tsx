"use client";

import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { MouseEventHandler } from "react";

interface NavBarBtnProps {
  className?: string;
  href: string;
  label: string;
  icon: IconDefinition;
  isActive?: boolean;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
}

const NavBarBtn = ({
  className = "",
  label,
  href,
  isActive = false,
  icon,
  onClick,
}: NavBarBtnProps) => {
  const baseClasses =
    "flex justify-start items-center w-full h-10 my-2 transition duration-200 rounded-lg cursor-pointer";
  const activeClasses = isActive
    ? "bg-orange-400 hover:bg-orange-500 text-black font-semibold"
    : "text-black hover:bg-gray-100 text-gray-600";

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`${baseClasses} ${activeClasses} ${className}`}
    >
      <div className="w-6 mx-4">
        <FontAwesomeIcon icon={icon} />
      </div>
      <div>{label}</div>
    </Link>
  );
};

export default NavBarBtn;
