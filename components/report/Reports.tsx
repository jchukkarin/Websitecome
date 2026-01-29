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
import { Icon } from "@iconify/react";
import ReportContainer from "./ReportContainer";
import { ReportItem } from "./report.types";

// Constants
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

  // Process data for the new ReportContainer
  const reportData: ReportItem[] = useMemo(() => {
    return data.map((item: any) => ({
      id: item.id,
      type: item.type === "INCOME" ? "IMPORT" :
        item.type === "CONSIGNMENT" ? "CONSIGN" :
          item.type as any,
      date: item.date,
      price: item.price,
      productName: item.productName
    }));
  }, [data]);

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
    <div className="max-w-[1600px] mx-auto p-4 md:p-8 space-y-12 animate-in fade-in duration-700">

      {/* Premium Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Chip variant="flat" color="danger" size="sm" className="font-bold uppercase tracking-widest px-2">
              Business Intelligence
            </Chip>
            <div className="flex items-center gap-1 text-green-500 text-xs font-bold">
              <Icon icon="mdi:trending-up" />
              <span>Real-time Update</span>
            </div>
          </div>
          <h1 className="text-5xl font-black text-gray-900 tracking-tighter">
            วิเคราะห์ <span className="text-red-600">Statistics</span>
          </h1>
          <p className="text-gray-500 font-medium text-lg">ศูนย์กลางข้อมูลเชิงลึกและการบริหารจัดการธุรกิจแบบครบวงจร</p>
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
              <Icon icon="mdi:refresh" width={20} />
            </Button>
          </div>
        </div>
      </div>

      {/* Overview Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<Icon icon="mdi:package-variant-closed" width={24} />}
          label="รายการนำเข้า"
          value={stats.counts.INCOME}
          color="danger"
          desc="จำนวนการรับสินค้าเข้าคลัง"
        />
        <StatCard
          icon={<Icon icon="mdi:handshake" width={24} />}
          label="รายการฝากขาย"
          value={stats.counts.CONSIGNMENT}
          color="default"
          desc="สินค้าประเภครับฝากขาย"
        />
        <StatCard
          icon={<Icon icon="mdi:wrench" width={24} />}
          label="รายการฝากซ่อม"
          value={stats.counts.REPAIR}
          color="warning"
          desc="สินค้าที่อยู่ระหว่างการซ่อม"
        />
        <StatCard
          icon={<Icon icon="mdi:hand-coin" width={24} />}
          label="รายการจำนำ"
          value={stats.counts.PAWN}
          color="danger"
          desc="สถิติการรับจำนำทั้งหมด"
        />
      </div>

      <ReportContainer data={reportData} />

      {/* Target & KPI Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <Card className="lg:col-span-12 bg-slate-900 border-none shadow-xl shadow-slate-200 rounded-[3rem] overflow-hidden text-white relative">
          <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12">
            <Icon icon="mdi:target" width={200} />
          </div>
          <CardBody className="p-10 flex flex-col md:flex-row justify-between items-center relative z-10 gap-10">
            <div className="space-y-6 flex-1">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                  <Icon icon="mdi:target" width={20} className="text-red-400" />
                </div>
                <h3 className="text-lg font-black uppercase tracking-wider">KPI Target Progress</h3>
              </div>
              <div className="space-y-4">
                <p className="text-6xl font-black">{monthlyProgress}%</p>
                <p className="text-sm text-slate-400 font-medium">เป้าหมายการทำรายการรวมทุกประเภทในเดือนปัจจุบัน (Goal: 100 txn)</p>
              </div>
              <Progress
                value={monthlyProgress}
                color="danger"
                size="lg"
                radius="full"
                className="max-w-md shadow-2xl"
                classNames={{
                  indicator: "bg-red-500",
                  track: "bg-white/10"
                }}
              />
            </div>

            <div className="w-full md:w-80 p-8 bg-white/5 rounded-[2rem] border border-white/10">
              <p className="text-xs text-slate-400 font-bold uppercase mb-6 tracking-widest text-center">Data Distribution</p>
              <div className="space-y-5">
                {stats.donutData.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm font-bold text-slate-300">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black">{item.value}</span>
                      <span className="text-[10px] font-bold text-slate-500">TXN</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Personnel Statistics */}
      <div className="space-y-8">
        <div className="flex items-center gap-4 border-l-8 border-red-600 pl-6 py-2">
          <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-600">
            <Icon icon="mdi:account-group" width={24} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">ทำเนียบผู้ใช้บริการสูงสุด</h2>
            <p className="text-gray-500 font-medium">สรุปรายชื่อลูกค้าที่มาใช้บริการบ่อยที่สุดแยกตามแผนก</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          <PersonnelCard title="นำเข้าสินค้า" data={personnelStats.import} icon={<Icon icon="mdi:package-variant-closed" />} color="bg-red-600" />
          <PersonnelCard title="ฝากขายสินค้า" data={personnelStats.consignment} icon={<Icon icon="mdi:handshake" />} color="bg-slate-900" />
          <PersonnelCard title="ฝากซ่อมสินค้า" data={personnelStats.repair} icon={<Icon icon="mdi:wrench" />} color="bg-slate-600" />
          <PersonnelCard title="รับจำนำสินค้า" data={personnelStats.pawn} icon={<Icon icon="mdi:hand-coin" />} color="bg-slate-400" />
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
          <Icon icon="mdi:account-group" className="text-slate-200" width={16} />
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
                {idx === 0 && <Icon icon="mdi:crown" className="text-amber-500" width={14} />}
                <div className="bg-slate-100 px-3 py-1 rounded-full text-[10px] font-black text-slate-600">
                  {person.count} <span className="text-[8px] opacity-70">ครั้ง</span>
                </div>
              </div>
            </div>
          )) : (
            <div className="py-10 text-center space-y-3">
              <Icon icon="mdi:account-off" width={32} className="mx-auto text-slate-100" />
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
