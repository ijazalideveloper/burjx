"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="bg-gray-900 py-4">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/markets" className="flex items-center">
              <div className="w-40 h-10 relative">
                <Image
                  src="/burjx-logo.png"
                  alt="BURJX"
                  width={160}
                  height={40}
                  className="object-contain"
                />
              </div>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-white focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            <NavLink href="/markets" isActive={pathname === "/markets"}>
              Markets
            </NavLink>
            <NavLink
              href="/exchange"
              isActive={pathname.startsWith("/exchange")}
            >
              Exchange
            </NavLink>
            <NavLink href="/wallet" isActive={pathname.startsWith("/wallet")}>
              Wallet
            </NavLink>
          </nav>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pt-4 border-t border-gray-800">
            <div className="flex flex-col space-y-4">
              <NavLink href="/markets" isActive={pathname === "/markets"}>
                Markets
              </NavLink>
              <NavLink
                href="/exchange"
                isActive={pathname.startsWith("/exchange")}
              >
                Exchange
              </NavLink>
              <NavLink href="/wallet" isActive={pathname.startsWith("/wallet")}>
                Wallet
              </NavLink>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  isActive: boolean;
}

function NavLink({ href, children, isActive }: NavLinkProps) {
  return (
    <Link
      href={href}
      className={`text-sm font-medium ${
        isActive ? "text-yellow-400" : "text-gray-300 hover:text-white"
      }`}
    >
      {children}
    </Link>
  );
}
