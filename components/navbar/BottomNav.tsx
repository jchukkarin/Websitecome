"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { Home, DollarSign, Briefcase, HandCoins, User } from "lucide-react";
import { useSession } from "next-auth/react";

const navItems = [
    { id: "home", label: "หน้าหลัก", icon: Home, href: "/dashboard" },
    { id: "income", label: "นำเข้า", icon: DollarSign, href: "/income/FormUsersIncome" },
    { id: "project", label: "รับซ่อม", icon: Briefcase, href: "/project" },
    { id: "pawn", label: "จำนำ", icon: HandCoins, href: "/expense" },
];

export default function BottomNav() {
    const pathname = usePathname();
    const router = useRouter();
    const { data: session } = useSession();

    return (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-xl border-t border-slate-100 flex items-center justify-around px-2 z-[100] shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
            {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                    <button
                        key={item.id}
                        onClick={() => router.push(item.href)}
                        className={`flex flex-col items-center justify-center gap-1 w-full h-full transition-all duration-300 ${isActive ? "text-blue-600 scale-110" : "text-slate-400"
                            }`}
                    >
                        <div className={`p-1 rounded-xl ${isActive ? "bg-blue-50" : ""}`}>
                            <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                        </div>
                        <span className={`text-[10px] font-black uppercase tracking-tighter ${isActive ? "opacity-100" : "opacity-60"}`}>
                            {item.label}
                        </span>

                        {isActive && (
                            <div className="w-1 h-1 rounded-full bg-blue-600 absolute bottom-1" />
                        )}
                    </button>
                );
            })}

            {/* Profile/User Button */}
            <button
                onClick={() => router.push("/profile/SetupFormProFileShop")}
                className={`flex flex-col items-center justify-center gap-1 w-full h-full ${pathname.includes("/profile") ? "text-blue-600" : "text-slate-400"
                    }`}
            >
                <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200">
                    {session?.user?.name ? (
                        <span className="text-[10px] font-bold text-slate-600">{session.user.name[0]}</span>
                    ) : (
                        <User size={14} />
                    )}
                </div>
                <span className="text-[10px] font-black uppercase tracking-tighter opacity-60">
                    ร้านค้า
                </span>
            </button>
        </div>
    );
}
