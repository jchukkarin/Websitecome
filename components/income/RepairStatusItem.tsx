"use client";
import React from "react";
import { ChevronRight } from "lucide-react";

export const RepairingItem = () => (
  <div className="flex items-center justify-between w-full py-1">
    <span>กำลังซ่อม</span>
    <ChevronRight size={18} className="text-slate-400" />
  </div>
);