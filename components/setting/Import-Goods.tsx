"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Skeleton,
} from "@heroui/react";
import { Eye, MoreVertical, Package, CheckCircle2, Clock, Hammer, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

type SummaryData = {
  ready: number;
  reserved: number;
  repair: number;
  sold: number;
};

type StatusRow = {
  key: keyof SummaryData;
  label: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
  count: number;
};

export default function ImportGoods() {
  const router = useRouter();
  const [summary, setSummary] = useState<SummaryData>({
    ready: 0,
    reserved: 0,
    repair: 0,
    sold: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/import-status");
      const result = await res.json();
      if (result.summary) {
        setSummary(result.summary);
      }
    } catch {
      toast.error("โหลดข้อมูลสถานะการนำเข้าล้มเหลว");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const rows: StatusRow[] = [
    {
      key: "ready",
      label: "พร้อม",
      icon: <CheckCircle2 size={18} />,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      count: summary.ready
    },
    {
      key: "reserved",
      label: "ติดจอง",
      icon: <Clock size={18} />,
      color: "text-amber-600",
      bg: "bg-amber-50",
      count: summary.reserved
    },
    {
      key: "repair",
      label: "ส่งซ่อม",
      icon: <Hammer size={18} />,
      color: "text-blue-600",
      bg: "bg-blue-50",
      count: summary.repair
    },
    {
      key: "sold",
      label: "ขายแล้ว",
      icon: <ShoppingCart size={18} />,
      color: "text-rose-600",
      bg: "bg-rose-50",
      count: summary.sold
    },
  ];

  const handleView = (status: string) => {
    router.push(`/income/history?status=${status}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 border-l-4 border-orange-500 pl-4 py-1">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">สรุปสถานะการนำเข้าสินค้า</h2>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Inventory Status Dashboard</p>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-hidden rounded-[2.5rem] border border-orange-100 shadow-xl shadow-orange-50 bg-white">
        <Table
          aria-label="Import Status Summary Table"
          shadow="none"
          classNames={{
            th: "bg-orange-50 text-orange-700 font-black text-xs uppercase tracking-widest py-6 border-b border-orange-100/50 px-8",
            td: "py-7 px-8",
            tr: "hover:bg-orange-50/40 transition-all cursor-pointer",
            base: "bg-white",
          }}
        >
          <TableHeader>
            <TableColumn>หมวดหมู่สถานะ</TableColumn>
            <TableColumn align="center" className="w-48">จำนวนสินค้า</TableColumn>
            <TableColumn align="center" className="w-32">ดูรายการ</TableColumn>
          </TableHeader>

          <TableBody
            isLoading={loading}
            loadingContent={<Skeleton className="w-full h-12 rounded-xl" />}
          >
            {rows.map((row) => (
              <TableRow
                key={row.key}
                className="group border-b border-orange-50/50 last:border-none"
                onClick={() => handleView(row.key)}
              >
                {/* หมวดหมู่ */}
                <TableCell>
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl ${row.bg} ${row.color} flex items-center justify-center shadow-inner transition-transform group-hover:scale-110`}>
                      {row.icon}
                    </div>
                    <div>
                      <span className="font-black text-slate-800 text-xl tracking-tight">
                        {row.label}
                      </span>
                      <p className={`text-[10px] font-black uppercase tracking-widest opacity-60 ${row.color}`}>
                        Status: {row.key}
                      </p>
                    </div>
                  </div>
                </TableCell>

                {/* จำนวนสินค้า */}
                <TableCell>
                  <div className="flex justify-center">
                    <span className="bg-orange-500 text-white px-6 py-2 rounded-2xl font-black text-xl shadow-lg shadow-orange-100 min-w-[80px] text-center">
                      {row.count}
                    </span>
                  </div>
                </TableCell>

                {/* ดูรายการ */}
                <TableCell>
                  <div className="flex justify-center">
                    <Dropdown>
                      <DropdownTrigger>
                        <Button
                          isIconOnly
                          variant="light"
                          className="text-slate-300 hover:text-orange-500 transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreVertical size={20} />
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu aria-label="Action Menu">
                        <DropdownItem
                          key="view"
                          startContent={<Eye size={18} className="text-orange-500" />}
                          onPress={() => handleView(row.key)}
                          className="font-bold text-slate-700"
                        >
                          ดูรายการสินค้าทั้งหมด
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Hint */}
      <div className="flex items-center gap-2 justify-center py-4">
        <div className="w-1.5 h-1.5 rounded-full bg-orange-200 animate-pulse" />
        <p className="text-[10px] font-black uppercase text-orange-200 tracking-[0.2em]">คลิกทั้งแถวเพื่อเข้าสู่หน้าประวัติข้อมูล</p>
        <div className="w-1.5 h-1.5 rounded-full bg-orange-200 animate-pulse" />
      </div>
    </div>
  );
}
