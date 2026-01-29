"use client";

import React, { useMemo } from "react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid
} from "recharts";
import { Card, CardBody, Button, Chip } from "@heroui/react";
import { Icon } from "@iconify/react";
import { ReportItem, TimeRange } from "./report.types";
import { groupByTime } from "./report.utils";
import { exportExcel } from "@/components/report/export/exportExcel";
import { exportPDF } from "@/components/report/export/exportPDF";

interface ReportChartProps {
    title: string;
    data: ReportItem[];
    timeRange: TimeRange;
    color?: string;
    icon: string;
    type: string;
}

export default function ReportChart({
    title,
    data,
    timeRange,
    color = "#dc2626",
    icon,
    type
}: ReportChartProps) {
    const chartData = useMemo(
        () => groupByTime(data, timeRange),
        [data, timeRange]
    );

    return (
        <Card className="bg-white border border-gray-100 shadow-xl shadow-gray-100/50 rounded-[2.5rem] overflow-hidden group hover:shadow-2xl transition-all duration-500">
            <CardBody className="p-8">
                <div className="flex justify-between items-start mb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg" style={{ backgroundColor: color }}>
                            <Icon icon={icon} width={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">{title}</h3>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Statistical Analysis</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            isIconOnly
                            size="sm"
                            variant="flat"
                            className="bg-emerald-50 text-emerald-600 rounded-xl"
                            onClick={() => exportExcel(title, data)}
                        >
                            <Icon icon="mdi:file-excel" width={18} />
                        </Button>
                        <Button
                            isIconOnly
                            size="sm"
                            variant="flat"
                            className="bg-red-50 text-red-600 rounded-xl"
                            onClick={() => exportPDF(title, data)}
                        >
                            <Icon icon="mdi:file-pdf-box" width={18} />
                        </Button>
                    </div>
                </div>

                <div className="h-64 w-full">
                    {chartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id={`color-${type}`} x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={color} stopOpacity={0.2} />
                                        <stop offset="95%" stopColor={color} stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="label"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    labelStyle={{ fontWeight: 'bold', color: '#111827' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke={color}
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill={`url(#color-${type})`}
                                    animationDuration={1500}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full gap-2 opacity-30">
                            <Icon icon="mdi:chart-areaspline" width={48} />
                            <p className="text-sm font-bold uppercase tracking-widest">No Data Available</p>
                        </div>
                    )}
                </div>
            </CardBody>
        </Card>
    );
}
