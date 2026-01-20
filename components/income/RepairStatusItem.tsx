"use client";
import React from "react";
import { ChevronRight } from "lucide-react";

export const RepairingItem = () => (
  <div className="flex items-center justify-between w-full px-4 py-2">
    <div className="flex items-center gap-2 text-amber-700">
      <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
      <span className="font-bold">ระบุกำหนดการซ่อม</span>
    </div>
    <ChevronRight size={18} className="text-amber-400" />
  </div>
);