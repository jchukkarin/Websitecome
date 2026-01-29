"use client";

import React, { useState } from "react";
import ReportTabs from "./ReportTabs";
import ReportChart from "./ReportChart";
import { ReportItem, TimeRange } from "./report.types";

const REPORT_CONFIG = [
    { key: "IMPORT", label: "รายการนำเข้าสินค้า", icon: "mdi:package-variant-closed", color: "#dc2626" },
    { key: "CONSIGN", label: "รายการฝากขายสินค้า", icon: "mdi:handshake", color: "#0f172a" },
    { key: "REPAIR", label: "รายการบริการฝากซ่อม", icon: "mdi:wrench", color: "#475569" },
    { key: "PAWN", label: "รายการรับจำนำสินค้า", icon: "mdi:hand-coin", color: "#94a3b8" },
];

export default function ReportContainer({ data }: { data: ReportItem[] }) {
    const [timeRange, setTimeRange] = useState<TimeRange>("MONTH");

    return (
        <div className="space-y-10">
            {/* Header Row with Title and Tabs */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Data Visualization</h2>
                    <p className="text-sm text-slate-500 font-medium">เปรียบเทียบสถิติการดำเนินงานแยกตามหมวดหมู่และช่วงเวลา</p>
                </div>

                <ReportTabs
                    timeRange={timeRange}
                    onTimeRangeChangeAction={setTimeRange}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
                {REPORT_CONFIG.map((cfg) => (
                    <ReportChart
                        key={cfg.key}
                        type={cfg.key}
                        title={cfg.label}
                        icon={cfg.icon}
                        color={cfg.color}
                        data={data.filter((d) => d.type === cfg.key)}
                        timeRange={timeRange}
                    />
                ))}
            </div>
        </div>
    );
}
