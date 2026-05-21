"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

export function Header() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  if (!session) return null;

  const isAdmin = session.user?.role === "ADMIN";

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-8">
            <Link href="/dashboard" className="text-xl font-bold text-brand-700">
              Open<span className="text-brand-500">Horn</span>
            </Link>
            <nav className="hidden md:flex space-x-6">
              <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
                Dashboard
              </Link>
              <Link href="/settings" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
                Settings
              </Link>
              {isAdmin && (
                <Link href="/settings/users" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
                  User Management
                </Link>
              )}
            </nav>
          </div>

          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center space-x-2 text-sm text-gray-700 hover:text-gray-900"
            >
              <div className="w-8 h-8 bg-brand-100 text-brand-700 rounded-full flex items-center justify-center font-medium">
                {session.user?.name?.[0]?.toUpperCase() || "U"}
              </div>
              <span className="hidden sm:block">{session.user?.name}</span>
              <span className="hidden sm:block text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                {session.user?.role}
              </span>
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                <Link
                  href="/settings"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  onClick={() => setMenuOpen(false)}
                >
                  Settings
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
