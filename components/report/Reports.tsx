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
  RotateCcw,
  Users,
  Package,
  Wrench,
  HandCoins,
  BadgeDollarSign,
  TrendingUp,
  Target,
  User as UserIcon,
  Crown
} from "lucide-react";
import {
  Button,
  Card,
  CardBody,
  Spinner,
  Chip,
  Avatar,
  Divider,
  Progress,
  Tabs,
  Tab
} from "@heroui/react";
import axios from "axios";

// Constants
const RED_COLORS = ["#dc2626", "#ef4444", "#f87171", "#fee2e2"];
const THEME_COLORS = {
  import: "#dc2626", // Red-600
  consignment: "#0f172a", // Slate-900
  repair: "#475569", // Slate-600
  pawn: "#94a3b8", // Slate-400
};

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

  // 1. Process Stats
  const stats = useMemo(() => {
    const total = data.length;
    const counts = {
      INCOME: data.filter(d => d.type === "INCOME").length,
      REPAIR: data.filter(d => d.type === "REPAIR").length,
      PAWN: data.filter(d => d.type === "PAWN").length,
      CONSIGNMENT: data.filter(d => d.type === "CONSIGNMENT").length,
    };

    const donutData = [
      { name: "นำเข้า", value: counts.INCOME, color: THEME_COLORS.import },
      { name: "ฝากขาย", value: counts.CONSIGNMENT, color: THEME_COLORS.consignment },
      { name: "จำนำ", value: counts.PAWN, color: THEME_COLORS.pawn },
      { name: "ฝากซ่อม", value: counts.REPAIR, color: THEME_COLORS.repair },
    ].filter(item => item.value > 0);

    return { total, counts, donutData };
  }, [data]);

  // 2. Trend Data
  const areaTrendData = useMemo(() => {
    const yearlyMap: Record<string, number> = {};
    data.forEach(d => {
      const year = new Date(d.date).getFullYear() + 543; // Thai Year
      yearlyMap[year] = (yearlyMap[year] || 0) + 1;
    });

    return Object.entries(yearlyMap)
      .map(([year, value]) => ({ year, value }))
      .sort((a, b) => a.year.localeCompare(b.year));
  }, [data]);

  // 3. User Statistics (Personnel)
  const personnelStats = useMemo(() => {
    const getTopPersonnel = (type: string) => {
      const filtered = data.filter(d => d.type === type);
      const nameMap: Record<string, number> = {};
      filtered.forEach(d => {
        const name = d.consignorName || "ไม่ระบุชื่อ";
        nameMap[name] = (nameMap[name] || 0) + 1;
      });
      return Object.entries(nameMap)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
    };

    return {
      import: getTopPersonnel("INCOME"),
      repair: getTopPersonnel("REPAIR"),
      consignment: getTopPersonnel("CONSIGNMENT"),
      pawn: getTopPersonnel("PAWN"),
    };
  }, [data]);

  // 4. Monthly Target
  const monthlyProgress = useMemo(() => {
    const thisMonth = new Date().getMonth();
    const count = data.filter(d => new Date(d.date).getMonth() === thisMonth).length;
    const target = 100;
    return Math.min(Math.round((count / target) * 100), 100);
  }, [data]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] gap-4">
        <Spinner size="lg" color="danger" />
        <p className="text-gray-500 font-bold animate-pulse">กำลังประมวลผลข้อมูลสถิติทางธุรกิจ...</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto p-4 md:p-8 space-y-10 animate-in fade-in duration-700">

      {/* Premium Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Chip variant="flat" color="danger" size="sm" className="font-bold uppercase tracking-widest px-2">
              Business Intelligence
            </Chip>
            <div className="flex items-center gap-1 text-green-500 text-xs font-bold">
              <TrendingUp size={14} />
              <span>Real-time Update</span>
            </div>
          </div>
          <h1 className="text-5xl font-black text-gray-900 tracking-tighter">
            สถิติการทำงาน <span className="text-red-600">Reports</span>
          </h1>
          <p className="text-gray-500 font-medium text-lg">วิเคราะห์และวางแผนการจัดการข้อมูลผ่านแดชบอร์ดอัจฉริยะ</p>
        </div>

        <div className="flex gap-4">
          <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 px-6 h-16">
            <div className="text-right">
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">วันที่ปัจจุบัน</p>
              <p className="text-sm font-bold text-gray-900">
                {new Date().toLocaleDateString("th-TH", { day: '2-digit', month: 'long', year: 'numeric' })}
              </p>
            </div>
            <Divider orientation="vertical" className="h-8" />
            <Button isIconOnly variant="flat" color="danger" radius="lg" onClick={fetchData} className="bg-red-50 text-red-600">
              <RotateCcw size={20} />
            </Button>
          </div>
        </div>
      </div>

      {/* Overview Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<Package size={24} />}
          label="รายการนำเข้า"
          value={stats.counts.INCOME}
          color="danger"
          desc="จำนวนการรับสินค้าเข้าคลัง"
        />
        <StatCard
          icon={<BadgeDollarSign size={24} />}
          label="รายการฝากขาย"
          value={stats.counts.CONSIGNMENT}
          color="default"
          desc="สินค้าประเภครับฝากขาย"
        />
        <StatCard
          icon={<Wrench size={24} />}
          label="รายการฝากซ่อม"
          value={stats.counts.REPAIR}
          color="warning"
          desc="สินค้าที่อยู่ระหว่างการซ่อม"
        />
        <StatCard
          icon={<HandCoins size={24} />}
          label="รายการจำนำ"
          value={stats.counts.PAWN}
          color="danger"
          desc="สถิติการรับจำนำทั้งหมด"
        />
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sales Trend Chart */}
        <Card className="lg:col-span-8 bg-white border-none shadow-xl shadow-gray-100/50 rounded-[3rem] overflow-hidden">
          <CardBody className="p-8 md:p-12">
            <div className="flex justify-between items-center mb-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-red-200">
                  <TrendingUp size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-gray-900 uppercase">Trend Analysis</h3>
                  <p className="text-sm text-gray-400 font-medium">สถิติการสะสมข้อมูลแยกตามปีงบประมาณ</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Chip variant="flat" color="danger" className="font-bold">Annual</Chip>
              </div>
            </div>

            <div className="h-72 w-full">
              {areaTrendData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={areaTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#dc2626" stopOpacity={0.1} />
                        <stop offset="95%" stopColor="#dc2626" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="#f1f5f9" />
                    <XAxis
                      dataKey="year"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 600 }}
                      dy={15}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 600 }}
                    />
                    <Tooltip
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      labelStyle={{ fontWeight: 'bold', color: '#111827' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#dc2626"
                      strokeWidth={4}
                      fillOpacity={1}
                      fill="url(#colorValue)"
                      animationDuration={2000}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400 font-bold">ยังไม่มีข้อมูลเพียงพอสำหรับการพล็อตกราฟ</div>
              )}
            </div>
          </CardBody>
        </Card>

        {/* Target Progress Card */}
        <Card className="lg:col-span-4 bg-slate-900 border-none shadow-xl shadow-slate-200 rounded-[3rem] overflow-hidden text-white relative">
          <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12">
            <Target size={200} />
          </div>
          <CardBody className="p-10 flex flex-col justify-between relative z-10">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                  <Target size={20} className="text-red-400" />
                </div>
                <h3 className="text-lg font-black uppercase tracking-wider">KPI Target</h3>
              </div>
              <div className="space-y-4">
                <p className="text-4xl font-black">{monthlyProgress}%</p>
                <p className="text-sm text-slate-400 font-medium">เป้าหมายการทำรายการในเดือนปัจจุบัน (Goal: 100 txn)</p>
              </div>
              <Progress
                value={monthlyProgress}
                color="danger"
                size="md"
                radius="full"
                className="max-w-md shadow-2xl"
                classNames={{
                  indicator: "bg-red-500",
                  track: "bg-white/10"
                }}
              />
            </div>

            <div className="pt-8 border-t border-white/10 mt-8">
              <p className="text-xs text-slate-400 font-bold uppercase mb-4 tracking-widest">Top Distribution</p>
              <div className="space-y-4">
                {stats.donutData.slice(0, 3).map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-xs font-bold text-slate-300">{item.name}</span>
                    </div>
                    <span className="text-xs font-black">{Math.round((item.value / stats.total) * 100)}%</span>
                  </div>
                ))}
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Personnel Statistics (The New Requested Section) */}
      <div className="space-y-6">
        <div className="flex items-center gap-4 border-l-8 border-red-600 pl-6 py-2">
          <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-600">
            <Users size={24} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">รายงานสถิรายชื่อผู้ติดต่อตามบริการ</h2>
            <p className="text-gray-500 font-medium italic">ข้อมูลสรุปจำนวนครั้งที่ผู้ติดต่อแต่ละรายมาทำรายการในระบบ (ไม่รวมสินค้า)</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          <PersonnelCard title="ผู้ติดต่อเบิกสินค้า" data={personnelStats.import} icon={<Package size={18} />} color="bg-red-600" />
          <PersonnelCard title="ผู้ฝากขายสินค้า" data={personnelStats.consignment} icon={<BadgeDollarSign size={18} />} color="bg-slate-900" />
          <PersonnelCard title="ผู้ฝากซ่อมสินค้า" data={personnelStats.repair} icon={<Wrench size={18} />} color="bg-slate-600" />
          <PersonnelCard title="ผู้มาจำนำสินค้า" data={personnelStats.pawn} icon={<HandCoins size={18} />} color="bg-slate-400" />
        </div>
      </div>
    </div>
  );
}

// Sub-components
function StatCard({ icon, label, value, color, desc }: any) {
  return (
    <Card className="bg-white border-none shadow-lg shadow-gray-100 rounded-3xl group hover:-translate-y-1 transition-all duration-300 overflow-hidden relative">
      <CardBody className="p-6">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 duration-500
          ${color === "danger" ? "bg-red-50 text-red-600" :
            color === "warning" ? "bg-amber-50 text-amber-600" :
              "bg-slate-50 text-slate-700"}
        `}>
          {icon}
        </div>
        <div className="space-y-1">
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest">{label}</p>
          <div className="flex items-baseline gap-2">
            <h4 className="text-4xl font-black text-gray-900">{value}</h4>
            <span className="text-xs text-gray-400 font-bold uppercase">Txn</span>
          </div>
          <p className="text-[10px] text-gray-400 font-medium pt-2 italic">{desc}</p>
        </div>
      </CardBody>
      <div className={`absolute bottom-0 right-0 p-4 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity`}>
        {icon}
      </div>
    </Card>
  );
}

function PersonnelCard({ title, data, icon, color }: any) {
  return (
    <Card className="bg-white border-none shadow-xl shadow-gray-100/50 rounded-[2.5rem] overflow-hidden group hover:shadow-2xl transition-all duration-500">
      <div className={`h-2 w-full ${color}`} />
      <CardBody className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 ${color} rounded-lg flex items-center justify-center text-white`}>
              {icon}
            </div>
            <h4 className="text-base font-black text-slate-900">{title}</h4>
          </div>
          <Users size={16} className="text-slate-200" />
        </div>

        <div className="space-y-4">
          {data.length > 0 ? data.map((person: any, idx: number) => (
            <div key={idx} className="flex items-center justify-between group/item p-2 hover:bg-slate-50 rounded-xl transition-colors">
              <div className="flex items-center gap-3">
                <Avatar
                  name={person.name}
                  size="sm"
                  radius="lg"
                  className="bg-slate-100 text-slate-600 font-black text-[10px]"
                />
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-700 truncate max-w-[120px]">{person.name}</span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">ประจำปี 2568</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {idx === 0 && <Crown size={12} className="text-amber-500" />}
                <div className="bg-slate-100 px-3 py-1 rounded-full text-[10px] font-black text-slate-600">
                  {person.count} <span className="text-[8px] opacity-70">ครั้ง</span>
                </div>
              </div>
            </div>
          )) : (
            <div className="py-10 text-center space-y-3">
              <UserIcon size={32} className="mx-auto text-slate-100" />
              <p className="text-xs text-slate-300 font-bold uppercase tracking-widest">ยังไม่มีข้อมูล</p>
            </div>
          )}
        </div>

        <Button
          variant="light"
          size="sm"
          className="w-full mt-6 font-black text-[10px] uppercase tracking-widest text-slate-400 hover:text-red-500"
        >
          View Full Report
        </Button>
      </CardBody>
    </Card>
  );
}