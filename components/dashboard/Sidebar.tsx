'use client'
import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import Footer from "./footer"

const navItems = [
  { id: "dashboard", label: "Dashboard", emoji: "🏠", href: "/dashboard" },
  { id: "income", label: "Income", emoji: "💰", href: "/income" },
  { id: "expenses", label: "Expenses", emoji: "💸", href: "/expense" },
  { id: "reports", label: "Reports", emoji: "📊", href: "/reports" },
  { id: "settings", label: "Settings", emoji: "⚙️", href: "/edit" },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <aside className="w-[280px] h-full bg-white rounded-2xl shadow-sm p-4 flex flex-col">
      
      {/* Logo */}
      <div className="text-xl font-bold mb-8 px-2 flex items-center gap-2 justify-center">
        <span className="text-yellow-500">Income</span>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href

          return (
            <motion.button
              key={item.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push(item.href)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition
                ${
                  isActive
                    ? "bg-yellow-100 text-yellow-700"
                    : "text-gray-600 hover:bg-gray-100"
                }
              `}
            >
              <span className="text-lg">{item.emoji}</span>
              {item.label}
            </motion.button>
          )
        })}
      </nav>
      <Footer />
    </aside>
  )
}
