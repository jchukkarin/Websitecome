"use client";
import { useState, useMemo } from "react"; // เพิ่ม useMemo เพื่อประสิทธิภาพ
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "./footer";
import { ChevronDown, Search, X } from "lucide-react";
import { SidebarSearch } from "./SidebarSearch"; // นำเข้า Component ที่สร้างใหม่
import {
  Home,
  BarChart2,
  DollarSign,
  Briefcase,
  CreditCard,
  HandCoins,
  User,
  Store,
  Settings,
} from "lucide-react";


const navItems = [
  {
    id: "dashboard",
    label: "หน้าหลัก",
    icon: Home,
    href: "/dashboard",
  },
  {
    id: "reports",
    label: "สถิติการทำงาน",
    icon: BarChart2,
    href: "/reports",
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
  },
  {
    id: "expenses",
    label: "การฝากขาย",
    icon: CreditCard,
    href: "/",
    subMenu: [
      { label: "ประวัติการฝากขาย", href: "/income/HistoryFormProDuct" },
      { label: "บันทึกการฝากขาย", href: "/income/FormProductIncome" },
    ],
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
  },
  {
    id: "profile",
    label: "โปรไฟล์",
    icon: User,
    href: "/profile",
  },
  {
    id: "shop-profile",
    label: "การตั้งค่าร้านค้า",
    icon: Store,
    href: "/profile/SetupFormProFileShop",
  },
  {
    id: "categories",
    label: "การตั้งค่าหมวดหมู่",
    icon: Settings,
    href: "/edit",
  },
];

export function Sidebar() {
  const [searchQuery, setSearchQuery] = useState("");
  const pathname = usePathname();
  const router = useRouter();
  // Logic การกรองข้อมูล (ยังคงไว้ที่นี่เพื่อให้ Sidebar จัดการเมนูที่จะแสดง)
  const filteredNavItems = useMemo(() => {
    if (!searchQuery) return navItems;
    const q = searchQuery.toLowerCase();
    return navItems.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.subMenu?.some((sub) => sub.label.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  // เก็บสถานะว่าเมนูไหนที่กางออกมา (Open Submenu)
  const [openMenus, setOpenMenus] = useState<string[]>([]);

  const toggleMenu = (id: string) => {
    setOpenMenus((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  return (
    <aside className="w-[280px] h-full bg-white rounded-2xl shadow-sm p-4 flex flex-col">
      {/* Logo */}
      <div className="text-xl font-bold mb-8 px-2 flex items-center gap-2 justify-center italic">
        <span className="text-yellow-500">Second-Hand Camera Shop Management System</span>
      </div>

      {/* เรียกใช้งาน Component Search */}
      <SidebarSearch
        value={searchQuery}
        onChange={setSearchQuery}
      />

      {/* Navigation */}
      <nav className="flex flex-col gap-1 overflow-y-auto flex-grow">
        {filteredNavItems.map((item) => {
          const Icon = item.icon;
          const hasSubMenu = !!item.subMenu;
          const isMenuOpen = openMenus.includes(item.id);
          const isActive = pathname === item.href || item.subMenu?.some(sub => pathname === sub.href);

          return (
            <div key={item.id} className="flex flex-col">
              {/* Main Menu Item */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => {
                  if (hasSubMenu) {
                    toggleMenu(item.id);
                  } else {
                    router.push(item.href);
                  }
                }}
                className={`flex items-center justify-between w-full gap-3 px-4 py-3 rounded-xl text-sm font-medium transition
                  ${isActive ? "bg-yellow-50 text-yellow-700" : "text-gray-600 hover:bg-gray-50"}
                `}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    size={20}
                    className={isActive ? "text-yellow-600" : "text-gray-400"}
                  />
                  <span className={isActive ? "font-bold" : ""}>
                    {item.label}
                  </span>
                </div>

                {hasSubMenu && (
                  <motion.div
                    animate={{ rotate: isMenuOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown size={16} className="text-gray-400" />
                  </motion.div>
                )}
              </motion.button>

              {/* Sub Menu Items */}
              <AnimatePresence>
                {hasSubMenu && isMenuOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden flex flex-col ml-10 mt-1 gap-1 border-l-2 border-gray-100"
                  >
                    {item.subMenu.map((sub) => (
                      <button
                        key={sub.label}
                        onClick={() => router.push(sub.href)}
                        className={`text-left px-4 py-2 text-xs rounded-lg transition
                          ${pathname === sub.href
                            ? "text-yellow-600 font-bold"
                            : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"}
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
        })}
      </nav>

      <div className="mt-auto">
        <Footer />
      </div>
    </aside>
  );
}