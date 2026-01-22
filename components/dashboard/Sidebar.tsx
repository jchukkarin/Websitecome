"use client";

import { useState, useMemo, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useSidebar } from "@/context/SidebarContext";
import {
  ChevronDown,
  Home,
  BarChart2,
  DollarSign,
  Briefcase,
  CreditCard,
  HandCoins,
  User,
  Store,
  Settings,
  Package,
  Clock,
  ChevronRight,
  LogOut,
  X
} from "lucide-react";
import { Tooltip, Button } from "@heroui/react";
import { useSession, signOut } from "next-auth/react";

const navItems = [
  {
    id: "dashboard",
    label: "หน้าหลัก",
    icon: Home,
    href: "/dashboard",
    roles: ["MANAGER", "EMPLOYEE"],
  },
  {
    id: "reports",
    label: "สถิติการทำงาน",
    icon: BarChart2,
    href: "/reports",
    roles: ["MANAGER"],
  },
  {
    id: "income",
    label: "การนำเข้า",
    icon: DollarSign,
    href: "/income",
    subMenu: [
      { label: "ประวัติข้อมูลนำเข้า", href: "/income/history" },
      { label: "บันทึกการนำเข้า", href: "/income/FormUsersIncome" },
    ],
    roles: ["MANAGER", "EMPLOYEE"],
  },
  {
    id: "project",
    label: "การฝากซ่อม",
    icon: Briefcase,
    href: "/project",
    subMenu: [
      { label: "ประวัติการฝากซ่อม", href: "/project/Repair-service-history" },
      { label: "บันทึกการฝากซ่อม", href: "/project" },
    ],
    roles: ["MANAGER", "EMPLOYEE"],
  },
  {
    id: "expenses",
    label: "การฝากขาย",
    icon: CreditCard,
    href: "/FormProductIncome",
    subMenu: [
      { label: "ประวัติการฝากขาย", href: "/income/HistoryFormProDuct" },
      { label: "บันทึกการฝากขาย", href: "/income/FormProductIncome" },
    ],
    roles: ["MANAGER", "EMPLOYEE"],
  },
  {
    id: "pawn",
    label: "การจำนำ",
    icon: HandCoins,
    href: "/expense",
    subMenu: [
      { label: "ประวัติการจำนำ", href: "/expense/ExpenseForm" },
      { label: "บันทึกการจำนำ", href: "/expense" },
    ],
    roles: ["MANAGER", "EMPLOYEE"],
  },
  {
    id: "shop-profile",
    label: "การตั้งค่าร้านค้า",
    icon: Store,
    href: "/profile/SetupFormProFileShop",
    roles: ["MANAGER"],
  },
  {
    id: "categories",
    label: "การตั้งค่าหมวดหมู่",
    icon: Settings,
    href: "/edit",
    roles: ["MANAGER"],
  },
];

export function Sidebar() {
  const { isCollapsed, isMobileOpen, toggleMobile, setIsMobileOpen } = useSidebar();
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [openMenus, setOpenMenus] = useState<string[]>([]);

  const userRole = (session?.user as any)?.role || "EMPLOYEE";

  const filteredNavItems = useMemo(() => {
    return navItems.filter((item) => item.roles.includes(userRole));
  }, [userRole]);

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname, setIsMobileOpen]);

  const toggleMenu = (id: string) => {
    if (isCollapsed && !isMobileOpen) return;
    setOpenMenus((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  const sidebarVariants = {
    desktop: { width: isCollapsed ? 84 : 280 },
    mobile: { x: isMobileOpen ? 0 : "-100%" }
  };

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleMobile}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] lg:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={typeof window !== 'undefined' && window.innerWidth < 1024 ? "mobile" : "desktop"}
        variants={sidebarVariants}
        className={`fixed inset-y-0 left-0 bg-white border-r border-slate-100 flex flex-col z-[70] transition-all duration-300
          lg:sticky lg:top-0 lg:h-screen lg:z-50
        `}
      >
        {/* Brand Logo Container */}
        <div className="h-[72px] flex items-center px-6 border-b border-slate-50 mb-4 overflow-hidden">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white flex-shrink-0">
            <Package size={20} />
          </div>
          <AnimatePresence>
            {(!isCollapsed || isMobileOpen) && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="ml-3 flex-1 whitespace-nowrap"
              >
                <div className="flex justify-between items-center w-full">
                  <div>
                    <h1 className="text-sm font-black text-slate-900 tracking-tight leading-none">
                      CAM-SHOP
                    </h1>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                      Admin Panel
                    </p>
                  </div>
                  {/* Mobile Close Button */}
                  <Button
                    isIconOnly
                    variant="light"
                    radius="full"
                    size="sm"
                    className="lg:hidden text-slate-400"
                    onPress={toggleMobile}
                  >
                    <X size={18} />
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto no-scrollbar">
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            const hasSubMenu = !!item.subMenu;
            const isMenuOpen = openMenus.includes(item.id);
            const isActive = pathname === item.href || item.subMenu?.some(sub => pathname === sub.href);
            const showFull = !isCollapsed || isMobileOpen;

            const content = (
              <div className="flex flex-col">
                <motion.button
                  whileHover={{ backgroundColor: isActive ? "rgba(59, 130, 246, 0.05)" : "rgba(248, 250, 252, 1)" }}
                  onClick={() => {
                    if (hasSubMenu) {
                      toggleMenu(item.id);
                      if (!showFull) router.push(item.href);
                    } else {
                      router.push(item.href);
                    }
                  }}
                  className={`flex items-center w-full h-11 px-3 rounded-xl transition-all duration-200 relative group
                    ${isActive ? "text-blue-600 font-bold" : "text-slate-500 hover:text-slate-900"}
                  `}
                >
                  {/* Active Indicator Bar */}
                  {isActive && (
                    <motion.div
                      layoutId="activeBar"
                      className="absolute left-0 w-1 h-5 bg-blue-600 rounded-r-full"
                    />
                  )}

                  <div className={`flex items-center justify-center flex-shrink-0 ${!showFull ? "w-full" : "w-6 mr-3"}`}>
                    <Icon size={20} className={isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"} />
                  </div>

                  {showFull && (
                    <div className="flex-1 flex items-center justify-between whitespace-nowrap overflow-hidden">
                      <span className="text-sm tracking-tight">{item.label}</span>
                      {hasSubMenu && (
                        <ChevronRight
                          size={14}
                          className={`transition-transform duration-200 text-slate-300 ${isMenuOpen ? "rotate-90 text-blue-400" : ""}`}
                        />
                      )}
                    </div>
                  )}
                </motion.button>

                {/* Submenu */}
                <AnimatePresence>
                  {showFull && hasSubMenu && isMenuOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="ml-9 mt-1 mb-2 space-y-1 overflow-hidden"
                    >
                      {item.subMenu.map((sub) => (
                        <button
                          key={sub.label}
                          onClick={() => router.push(sub.href)}
                          className={`w-full text-left px-3 py-2 text-xs rounded-lg transition-colors whitespace-nowrap
                            ${pathname === sub.href
                              ? "bg-blue-50/50 text-blue-700 font-bold border-l-2 border-blue-500 rounded-l-none"
                              : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"}
                          `}
                        >
                          {sub.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );

            if (isCollapsed && !isMobileOpen) {
              return (
                <Tooltip key={item.id} content={item.label} placement="right" color="primary" offset={15}>
                  {content}
                </Tooltip>
              );
            }

            return <div key={item.id}>{content}</div>;
          })}
        </nav>

        {/* Footer / User Session */}
        <div className={`p-4 border-t border-slate-50 space-y-3 ${isCollapsed && !isMobileOpen ? "items-center" : ""}`}>
          <AnimatePresence>
            {(!isCollapsed || isMobileOpen) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-slate-900 rounded-2xl p-4 text-white relative overflow-hidden group cursor-pointer"
              >
                {/* Background Glow */}
                <div className="absolute -right-4 -top-4 w-16 h-16 bg-blue-600/20 rounded-full blur-2xl group-hover:bg-blue-600/40 transition-all duration-500" />

                <div className="flex items-center gap-3 relative z-10">
                  <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center font-bold text-xs ring-2 ring-white/20">
                    {session?.user?.name?.[0] || session?.user?.email?.[0] || 'U'}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-xs font-black truncate uppercase tracking-tighter">{session?.user?.name || "User"}</p>
                    <p className="text-[10px] text-blue-300 font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" /> {userRole}
                    </p>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="mt-4 w-full h-8 bg-white/10 hover:bg-white/20 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all border border-white/5 shadow-xl"
                >
                  <LogOut size={12} /> Sign Out
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {isCollapsed && !isMobileOpen && (
            <Tooltip content="Sign Out" placement="right" color="danger">
              <Button
                isIconOnly
                variant="flat"
                color="danger"
                radius="lg"
                size="md"
                className="w-full h-12"
                onPress={() => signOut({ callbackUrl: "/login" })}
              >
                <LogOut size={18} />
              </Button>
            </Tooltip>
          )}
        </div>
      </motion.aside>
    </>
  );
}