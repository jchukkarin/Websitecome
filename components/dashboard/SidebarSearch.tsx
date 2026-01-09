"use client";
import { Search, X } from "lucide-react";

interface SearchProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export function SidebarSearch({ value, onChange, placeholder = "ค้นหาเมนู..." }: SearchProps) {
  return (
    <div className="relative mb-6 px-2">
      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400">
        <Search size={16} />
      </div>
      
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-transparent rounded-xl text-sm 
                   focus:bg-white focus:ring-2 focus:ring-yellow-400 focus:border-transparent 
                   outline-none transition-all duration-200"
      />

      {/* ปุ่ม Clear เมื่อมีข้อความ */}
      {value && (
        <button 
          onClick={() => onChange("")}
          className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}