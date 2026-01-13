"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import {
  ArrowUpRight,
  LogOut,
  UserCircle,
  MoreHorizontal,
  RotateCcw
} from "lucide-react";
import { Button, Card, CardBody, Spinner } from "@heroui/react";
import axios from "axios";

// Constants
const GAUGE_COLORS = ["#3b82f6", "#e5e7eb"];

export default function Reports() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/consignments");
      setData(res.data);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  // 1. Process Stats Cards & Donut Chart
  const stats = useMemo(() => {
    const total = data.length;
    const items = {
      INCOME: data.filter(d => d.type === "INCOME").length,
      REPAIR: data.filter(d => d.type === "REPAIR").length,
      PAWN: data.filter(d => d.type === "PAWN").length,
      CONSIGNMENT: data.filter(d => d.type === "CONSIGNMENT").length,
    };

    const donutData = [
      { name: "การนำเข้า", value: items.INCOME, color: "#10b981" },
      { name: "การฝากขาย", value: items.CONSIGNMENT, color: "#f59e0b" },
      { name: "การจำนำ", value: items.PAWN, color: "#6366f1" },
      { name: "การฝากซ่อม", value: items.REPAIR, color: "#facc15" },
    ].filter(item => item.value > 0);

    return { total, items, donutData };
  }, [data]);

  // 2. Process Trend Area Chart (By Year)
  const areaTrendData = useMemo(() => {
    const yearlyMap: Record<string, number> = {};
    data.forEach(d => {
      const year = new Date(d.date).getFullYear().toString();
      yearlyMap[year] = (yearlyMap[year] || 0) + 1;
    });

    return Object.entries(yearlyMap)
      .map(([year, value]) => ({ year, value }))
      .sort((a, b) => a.year.localeCompare(b.year));
  }, [data]);

  // 3. Process Daily Usage Bar Chart (Last 7 Days)
  const dailyUsageData = useMemo(() => {
    const days = ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"];
    const now = new Date();
    const result = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const dayName = days[d.getDay()];
      const isToday = i === 0;

      const count = data.filter(record => {
        const recordDate = new Date(record.date);
        return recordDate.toDateString() === d.toDateString();
      }).length;

      result.push({
        name: isToday ? "วันนี้" : dayName,
        value: count,
        display: dayName
      });
    }
    return result;
  }, [data]);

  // 4. Process Pawn Sales Stacked Bar Chart
  const pawnSalesData = useMemo(() => {
    const days = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"];
    const pawnRecords = data.filter(d => d.type === "PAWN");

    return days.map(day => {
      const recordsForDay = pawnRecords.filter(p => {
        const d = new Date(p.date);
        return days[d.getDay()] === day;
      });

      // Simple status mapping based on mock or simplified logic
      // In a real app, you'd check p.items[0].status or similar
      const current = recordsForDay.length * 10; // Scaled for visual
      const overtime = recordsForDay.filter(r => r.items?.some((i: any) => i.status === "ชำรุด")).length * 5;
      const completed = recordsForDay.filter(r => r.items?.some((i: any) => i.status === "ปกติ")).length * 8;

      return { day, current, overtime, completed };
    });
  }, [data]);

  // 5. Gauge Data (Based on this month's goal of 100 records)
  const gaugeInfo = useMemo(() => {
    const thisMonth = new Date().getMonth();
    const count = data.filter(d => new Date(d.date).getMonth() === thisMonth).length;
    const target = 100;
    const percent = Math.min(Math.round((count / target) * 100), 100);

    return [
      { name: "Used", value: percent },
      { name: "Remaining", value: 100 - percent },
    ];
  }, [data]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner label="กำลังโหลดข้อมูลสถิติ..." size="lg" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-8">
      <div className="space-y-8">

        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-gray-900">สถิติการทำงาน</h1>
            <p className="text-sm text-gray-500">แสดงผลสถิติการทำงานจริงภายในระบบ</p>
          </div>
          <div className="flex gap-2">
            <Button isIconOnly variant="light" radius="full" size="sm" onClick={fetchData}>
              <RotateCcw size={20} className="text-gray-400" />
            </Button>
            <Button isIconOnly variant="light" radius="full" size="sm">
              <UserCircle size={24} className="text-gray-400" />
            </Button>
            <Button isIconOnly variant="light" radius="full" size="sm">
              <LogOut size={24} className="text-gray-400" />
            </Button>
          </div>
        </div>

        {/* Dashboard Title & Date */}
        <div className="space-y-1">
          <p className="text-sm font-bold text-gray-900">
            {new Date().toLocaleDateString("th-TH", { day: '2-digit', month: '2-digit', year: 'numeric' })}
          </p>
          <p className="text-xs text-gray-400 font-semibold tracking-wider uppercase">Live Dashboard</p>
        </div>

        {/* Top Row Charts */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Gauge Chart */}
          <Card className="md:col-span-3 border-none shadow-sm" radius="lg">
            <CardBody className="p-6 flex flex-col items-center justify-between text-center relative">
              <p className="text-sm font-bold mb-4">อัตราการทำรายการเดือนนี้</p>
              <div className="w-40 h-24 relative mt-4">
                <ResponsiveContainer width="100%" height="200%" className="-mt-16">
                  <PieChart>
                    <Pie
                      data={gaugeInfo}
                      cx="50%"
                      cy="50%"
                      startAngle={180}
                      endAngle={0}
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={0}
                      dataKey="value"
                    >
                      {gaugeInfo.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={GAUGE_COLORS[index]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pt-8">
                  <span className="text-3xl font-bold text-gray-900">{gaugeInfo[0].value}%</span>
                  <span className="text-[10px] text-gray-400 uppercase">ของเป้าหมาย</span>
                </div>
              </div>
              <Button color="primary" size="sm" className="w-full mt-10 h-8 text-xs font-bold rounded-lg py-1">
                รายละเอียด
              </Button>
            </CardBody>
          </Card>

          {/* Daily Bar Chart */}
          <Card className="md:col-span-3 border-none shadow-sm" radius="lg">
            <CardBody className="p-6 text-center md:text-left">
              <div className="flex justify-between items-center mb-1">
                <p className="text-sm font-bold">{data.length} รายการ <span className="text-green-500">✦</span></p>
              </div>
              <p className="text-[10px] text-gray-400 font-medium mb-4">จำนวนการเพิ่มข้อมูลใน 7 วันล่าสุด</p>
              <div className="h-40 w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dailyUsageData}>
                    <Bar
                      dataKey="value"
                      fill="#3b82f6"
                      radius={[4, 4, 4, 4]}
                      barSize={12}
                    >
                      {dailyUsageData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.name === "วันนี้" ? "#3b82f6" : "#e5e7eb"} />
                      ))}
                    </Bar>
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 8, fill: '#9ca3af', fontWeight: 600 }}
                      interval={0}
                      dy={8}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardBody>
          </Card>

          {/* Trend Area Chart */}
          <Card className="md:col-span-6 border-none shadow-sm" radius="lg">
            <CardBody className="p-6">
              <div className="flex justify-between items-center mb-6">
                <p className="text-sm font-bold">เทรนด์การสะสมข้อมูล</p>
                <div className="flex items-center gap-1 border border-gray-100 rounded-md px-2 py-1 cursor-pointer">
                  <span className="text-[10px] font-bold">รายปี</span>
                  <MoreHorizontal size={12} className="rotate-90 text-gray-400" />
                </div>
              </div>
              <div className="h-40 w-full text-center">
                {areaTrendData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={areaTrendData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis
                        dataKey="year"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 10, fill: '#9ca3af', fontWeight: 600 }}
                        dy={10}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 10, fill: '#9ca3af', fontWeight: 600 }}
                      />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#10b981"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorValue)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-xs text-gray-400 pt-16">ยังไม่มีข้อมูลรายปี</p>
                )}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "จำนวนนำเข้า", value: stats.items.INCOME, color: "text-green-600" },
            { label: "จำนวนฝากขาย", value: stats.items.CONSIGNMENT, color: "text-purple-600" },
            { label: "จำนวนฝากซ่อม", value: stats.items.REPAIR, color: "text-blue-600" },
            { label: "จำนวนจำนำ", value: stats.items.PAWN, color: "text-red-600" },
          ].map((stat, idx) => (
            <Card key={idx} className="border-none shadow-sm" radius="lg">
              <CardBody className="p-5 space-y-2">
                <p className="text-xs font-bold text-gray-900">{stat.label}</p>
                <p className="text-[8px] text-gray-400 font-medium">ข้อมูลทั้งหมดในระบบ</p>
                <div className="flex items-end gap-2">
                  <span className={`text-3xl font-bold ${stat.color}`}>{stat.value}</span>
                  <span className="text-xs text-gray-400 mb-1">รายการ</span>
                </div>
                <p className="text-[8px] text-yellow-500 font-bold flex items-center gap-1 group cursor-pointer hover:underline underline-offset-2 decoration-yellow-500">
                  ดูรายงานฉบับเต็ม <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                </p>
              </CardBody>
            </Card>
          ))}
        </div>

        {/* Bottom Row Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Stacked Horizontal Bar Chart */}
          <Card className="lg:col-span-8 border-none shadow-sm" radius="lg">
            <CardBody className="p-8">
              <h3 className="text-sm font-bold mb-8">ความเคลื่อนไหวของการจำนำ</h3>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={pawnSalesData}
                    layout="vertical"
                    margin={{ left: 20, right: 30 }}
                  >
                    <CartesianGrid strokeDasharray="0 0" horizontal={false} vertical={true} stroke="#f0f0f0" />
                    <XAxis
                      type="number"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10, fill: '#9ca3af', fontWeight: 600 }}
                      dy={10}
                    />
                    <YAxis
                      type="category"
                      dataKey="day"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11, fill: '#9ca3af', fontWeight: 600 }}
                      dx={-10}
                    />
                    <Tooltip cursor={{ fill: 'transparent' }} />
                    <Bar dataKey="current" stackId="a" fill="#3b82f6" barSize={12} />
                    <Bar dataKey="overtime" stackId="a" fill="#ef4444" barSize={12} />
                    <Bar dataKey="completed" stackId="a" fill="#2dd4bf" barSize={12} radius={[0, 2, 2, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-end gap-6 mt-6 px-10">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
                  <span className="text-[10px] font-bold text-gray-500 uppercase">ปกติ</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-sm"></div>
                  <span className="text-[10px] font-bold text-gray-500 uppercase">ชำรุด</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-teal-400 rounded-sm"></div>
                  <span className="text-[10px] font-bold text-gray-500 uppercase">รวม</span>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Donut Chart */}
          <Card className="lg:col-span-4 border-none shadow-sm" radius="lg">
            <CardBody className="p-8 space-y-8">
              <h3 className="text-sm font-bold mb-4">สัดส่วนประเภทข้อมูล</h3>
              <div className="h-64 w-full relative flex flex-col items-center justify-center">
                {stats.donutData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats.donutData}
                        innerRadius={80}
                        outerRadius={105}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                      >
                        {stats.donutData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-xs text-gray-400 uppercase">ไม่มีข้อมูล</p>
                )}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Total</span>
                  <span className="text-xl font-bold text-gray-900">{stats.total}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-y-4 gap-x-2 pt-6">
                {stats.donutData.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }}></div>
                    <span className="text-[10px] font-bold text-gray-500 truncate">{item.name}</span>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>

      </div>
    </div>
  );
}