"use client";

import {
  Building,
  Bell,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Search,
  Settings,
  Shield,
  Sun,
  User,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { useTheme } from "@/lib/hooks/use-theme";
import { useLogout } from "../logout/hooks/use-logout";
import { useAuthStore } from "@/lib/store/auth";

const ADMIN_NAV = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Organizations", href: "/organizations", icon: Building },
  { label: "Users", href: "/users", icon: Users },
  // { label: "Settings", href: "/settings", icon: Settings },
] as const;

const LOGO_ICON = () => (
  <div className="w-5 h-5 rounded-full border-[3px] border-current flex items-center justify-center relative">
    <div className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-current rounded-full" />
    <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-current rounded-full" />
  </div>
);

export function AdminShell({
  children,
  title = "Awtar AI",
}: {
  children: ReactNode;
  title?: string;
}) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<"notifications" | "user" | null>(
    null,
  );
  const logout = useLogout();

  const userId = useAuthStore((state) => state.userId);

  const toggleMenu = (menu: "notifications" | "user") => {
    setActiveMenu(activeMenu === menu ? null : menu);
  };

  const displayName = "Admin";
  const email = "";
  const userInitials = "A";

  const handleSignOut = () => {
    setActiveMenu(null);
    logout();
  };

  // Prevent background scroll when mobile sidebar is open
  useEffect(() => {
    if (typeof window === "undefined") return;
    document.body.style.overflow = mobileOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [mobileOpen]);

  const isDark = theme === "dark";

  return (
    <div
      className={`flex min-h-screen ${
        isDark ? "bg-awtar-navy text-awtar-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:fixed lg:left-0 lg:top-0 lg:bottom-0 lg:flex lg:w-64 lg:flex-col lg:border-r lg:shadow-lg shrink-0 ${
          isDark
            ? "border-white/10 bg-linear-to-b from-awtar-navy-light to-awtar-navy"
            : "border-gray-200 bg-white"
        }`}
      >
        {/* Logo Area */}
        <div
          className={`h-16 flex items-center px-6 border-b shrink-0 ${
            isDark ? "border-white/10" : "border-gray-100"
          }`}
        >
          <Link
            href="/dashboard"
            className={`flex items-center gap-2 hover:opacity-80 transition-opacity ${
              isDark ? "text-awtar-white" : "text-gray-900"
            }`}
          >
            {/* Logo Icon */}
            <div className="flex items-center gap-1.5 text-blue-600">
              <LOGO_ICON />
            </div>
            <span
              className={`text-lg font-bold tracking-tight ${isDark ? "text-awtar-white" : "text-blue-700"}`}
            >
              {title}
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {ADMIN_NAV.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? isDark
                      ? "bg-awtar-blue text-white"
                      : "bg-blue-50 text-blue-700"
                    : isDark
                      ? "text-awtar-slate hover:bg-white/10 hover:text-white"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Icon
                  className={`w-5 h-5 ${
                    isActive
                      ? isDark
                        ? "text-white"
                        : "text-blue-700"
                      : isDark
                        ? "text-awtar-slate"
                        : "text-gray-400"
                  }`}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Theme Toggle */}
        <div
          className={`p-3 shrink-0 border-t ${
            isDark ? "border-white/10" : "border-gray-100"
          }`}
        >
          <button
            type="button"
            onClick={toggleTheme}
            className={`flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              isDark
                ? "bg-white/10 text-awtar-white hover:bg-white/20"
                : "bg-gray-100 text-gray-900 hover:bg-gray-200"
            }`}
          >
            {isDark ? (
              <>
                <Sun className="h-4 w-4" />
                <span className="hidden sm:inline">Light</span>
              </>
            ) : (
              <>
                <Moon className="h-4 w-4" />
                <span className="hidden sm:inline">Dark</span>
              </>
            )}
          </button>
        </div>
      </aside>

      {/* Mobile slide-over sidebar */}
      {/* Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          aria-hidden
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 transform transition-transform lg:hidden flex flex-col shrink-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } shadow-lg ${
          isDark
            ? "border-r border-white/10 bg-linear-to-b from-awtar-navy-light to-awtar-navy"
            : "border-r border-gray-200 bg-white"
        }`}
        aria-hidden={!mobileOpen}
      >
        {/* Logo Area */}
        <div
          className={`h-16 flex items-center justify-between px-6 border-b shrink-0 ${
            isDark ? "border-white/10" : "border-gray-100"
          }`}
        >
          <Link
            href="/dashboard"
            className={`flex items-center gap-2 hover:opacity-80 transition-opacity ${
              isDark ? "text-awtar-white" : "text-gray-900"
            }`}
            onClick={() => setMobileOpen(false)}
          >
            {/* Logo Icon */}
            <div className="flex items-center gap-1.5 text-red-600">
              <LOGO_ICON />
            </div>
            <span
              className={`text-lg font-bold tracking-tight ${isDark ? "text-awtar-white" : "text-gray-900"}`}
            >
              {title}
            </span>
          </Link>
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
            className={`-mr-2 rounded-md p-2 ${isDark ? "text-awtar-white" : "text-gray-700"}`}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {ADMIN_NAV.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? isDark
                      ? "bg-awtar-blue text-white"
                      : "bg-blue-50 text-blue-700"
                    : isDark
                      ? "text-awtar-slate hover:bg-white/10 hover:text-white"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Icon
                  className={`w-5 h-5 ${
                    isActive
                      ? isDark
                        ? "text-white"
                        : "text-blue-700"
                      : isDark
                        ? "text-awtar-slate"
                        : "text-gray-400"
                  }`}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Theme Toggle */}
        <div
          className={`p-3 shrink-0 border-t ${
            isDark ? "border-white/10" : "border-gray-100"
          }`}
        >
          <button
            type="button"
            onClick={() => {
              toggleTheme();
              setMobileOpen(false);
            }}
            className={`flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              isDark
                ? "bg-white/10 text-awtar-white hover:bg-white/20"
                : "bg-gray-100 text-gray-900 hover:bg-gray-200"
            }`}
          >
            {isDark ? (
              <>
                <Sun className="h-4 w-4" />
                <span className="hidden sm:inline">Light</span>
              </>
            ) : (
              <>
                <Moon className="h-4 w-4" />
                <span className="hidden sm:inline">Dark</span>
              </>
            )}
          </button>
        </div>
      </aside>

      <main
        className={`min-w-0 flex-1 flex flex-col lg:ml-64 transition-colors ${
          isDark ? "bg-slate-950 text-awtar-white" : "bg-gray-50 text-gray-900"
        }`}
      >
        {/* Desktop Header */}
        <header
          className={`hidden lg:flex h-16 border-b items-center justify-between px-6 shrink-0 z-40 relative ${
            isDark ? "border-white/10 bg-slate-900" : "border-gray-200 bg-white"
          }`}
        >
          <div className="flex-1 max-w-xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className={`w-full pl-10 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                  isDark
                    ? "bg-white/10 border-transparent text-white placeholder-gray-400 focus:bg-white/20 focus:border-transparent"
                    : "bg-gray-50 border-transparent text-gray-900 focus:bg-white focus:border-transparent"
                }`}
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <button
                type="button"
                onClick={() => toggleMenu("notifications")}
                className={`relative p-2 rounded-full transition-colors ${
                  isDark
                    ? "text-gray-400 hover:text-gray-200 hover:bg-white/10"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>

              {activeMenu === "notifications" && (
                <div
                  className={`absolute right-0 mt-2 w-80 rounded-2xl shadow-xl border p-4 animate-in fade-in zoom-in-95 duration-200 z-50 ${
                    isDark
                      ? "border-white/10 bg-slate-800"
                      : "border-gray-100 bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4
                      className={`text-sm font-black ${isDark ? "text-white" : "text-gray-900"}`}
                    >
                      Notifications
                    </h4>
                    <button
                      type="button"
                      className="text-[10px] font-black text-blue-600 cursor-pointer hover:underline"
                    >
                      Mark all as read
                    </button>
                  </div>
                  <div className="space-y-3">
                    {["notif-1", "notif-2"].map((notifId) => (
                      <button
                        type="button"
                        key={notifId}
                        className={`w-full flex gap-3 p-2 rounded-xl transition-colors cursor-pointer group border-none text-left ${
                          isDark ? "hover:bg-white/10" : "hover:bg-gray-50"
                        }`}
                      >
                        <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                          <Bell className="w-5 h-5" />
                        </div>
                        <div>
                          <p
                            className={`text-xs font-bold ${isDark ? "text-gray-200 group-hover:text-blue-400" : "text-gray-900 group-hover:text-blue-600"} transition-colors`}
                          >
                            New user registered in system.
                          </p>
                          <p
                            className={`text-[10px] font-medium mt-1 ${isDark ? "text-gray-500" : "text-gray-400"}`}
                          >
                            2 hours ago
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    className={`w-full mt-4 py-2 text-[10px] font-black transition-colors ${
                      isDark
                        ? "text-gray-500 hover:text-gray-300"
                        : "text-gray-400 hover:text-gray-900"
                    }`}
                  >
                    See all notifications
                  </button>
                </div>
              )}
            </div>

            <button
              type="button"
              className={`p-2 rounded-full transition-colors ${
                isDark
                  ? "text-gray-400 hover:text-gray-200 hover:bg-white/10"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Settings className="w-5 h-5" />
            </button>

            <div className="relative">
              <button
                type="button"
                onClick={() => toggleMenu("user")}
                className={`flex items-center gap-2 p-1 pl-2 rounded-full transition-all border ${
                  isDark
                    ? "hover:bg-white/10 border-transparent hover:border-white/20"
                    : "hover:bg-gray-50 border-transparent hover:border-gray-100"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full overflow-hidden border flex items-center justify-center text-xs font-bold ${
                    isDark
                      ? "border-white/20 bg-awtar-blue text-white"
                      : "border-gray-200 bg-blue-50 text-blue-600"
                  }`}
                >
                  {userInitials}
                </div>
              </button>

              {activeMenu === "user" && (
                <div
                  className={`absolute right-0 mt-2 w-56 rounded-2xl shadow-xl border p-2 animate-in fade-in zoom-in-95 duration-200 z-50 ${
                    isDark
                      ? "border-white/10 bg-slate-800"
                      : "border-gray-100 bg-white"
                  }`}
                >
                  <div
                    className={`p-3 border-b mb-1 ${isDark ? "border-white/10" : "border-gray-50"}`}
                  >
                    <p
                      className={`text-xs font-black ${isDark ? "text-white" : "text-gray-900"}`}
                    >
                      {displayName}
                    </p>
                    <p
                      className={`text-[10px] font-medium truncate mt-1 ${isDark ? "text-gray-400" : "text-gray-400"}`}
                    >
                      {email || "—"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    {[
                      {
                        label: "Dashboard",
                        icon: LayoutDashboard,
                        href: "/dashboard",
                      },
                      { label: "Settings", icon: Settings, href: "/settings" },
                    ].map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        className={`w-full flex items-center gap-3 p-2 rounded-xl transition-colors text-xs font-bold ${
                          isDark
                            ? "text-gray-300 hover:text-white hover:bg-white/10"
                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                        }`}
                        onClick={() => setActiveMenu(null)}
                      >
                        <item.icon className="w-4 h-4" /> {item.label}
                      </Link>
                    ))}
                  </div>
                  <div
                    className={`mt-1 pt-1 border-t ${isDark ? "border-white/10" : "border-gray-50"}`}
                  >
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className={`w-full flex items-center gap-3 p-2 rounded-xl transition-colors text-xs font-bold ${
                        isDark
                          ? "text-red-400 hover:bg-red-500/20"
                          : "text-red-600 hover:bg-red-50"
                      }`}
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Mobile top bar with hamburger */}
        <div
          className={`mb-4 flex items-center justify-between lg:hidden p-4 border-b ${
            isDark ? "border-white/10" : "border-gray-200"
          }`}
        >
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setMobileOpen(true)}
            className={`rounded-md p-2 ${isDark ? "text-awtar-white" : "text-gray-700"}`}
          >
            <Menu className="h-6 w-6" />
          </button>
          <div
            className={`text-lg font-semibold ${isDark ? "text-awtar-white" : "text-gray-900"}`}
          >
            {title}
          </div>
          <div className="w-8" />
        </div>

        <div className="flex-1 overflow-auto p-6 lg:p-10">{children}</div>
      </main>
    </div>
  );
}
