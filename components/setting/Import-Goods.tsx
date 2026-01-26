"use client";

import React, { useEffect, useState } from "react";
import {
  Input,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
} from "@heroui/react";
import { Search, Info, Package } from "lucide-react";
import { toast } from "react-hot-toast";

type CategoryData = {
  id: number;
  name: string;
  count: number;
  details: {
    ready: number;
    reserved: number;
    repair: number;
    sold: number;
  };
};

type ImportApiResponse = {
  summary: {
    ready: number;
    reserved: number;
    repair: number;
    sold: number;
  };
  categories: CategoryData[];
};

export default function ImportGoods() {
  const [summary, setSummary] = useState({ ready: 0, reserved: 0, repair: 0, sold: 0 });
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/import-status");
      const result: ImportApiResponse = await res.json();
      setSummary(result.summary);
    } catch (error) {
      toast.error("โหลดข้อมูลสถานะสินค้าล้มเหลว");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const summaryRows = [
    { id: 'ready', label: 'พร้อม', count: summary.ready, code: 'READY' },
    { id: 'reserved', label: 'ติดจอง', count: summary.reserved, code: 'RESERVED' },
    { id: 'repair', label: 'ซ่อม', count: summary.repair, code: 'REPAIR' },
    { id: 'sold', label: 'ขายแล้ว', count: summary.sold, code: 'SOLD' },
  ];

  const filteredSummary = summaryRows.filter((r) =>
    r.label.toLowerCase().includes(search.toLowerCase()) ||
    r.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="w-full sm:max-w-md">
          <Input
            placeholder="ค้นหาสถานะการนำเข้า..."
            startContent={<Search size={20} className="text-gray-400" />}
            variant="flat"
            radius="lg"
            size="lg"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            classNames={{
              inputWrapper: "bg-gray-100/50 hover:bg-gray-100 transition-colors border-none",
              input: "text-base",
            }}
          />
        </div>
      </div>

      <div className="flex items-center gap-3 border-l-4 border-red-500 pl-4 py-1">
        <h2 className="text-2xl font-black text-gray-900 tracking-tight">รายการสถานะการนำเข้าสินค้า</h2>
        <Tooltip content="รายการสรุปสถานะสินค้าทั้งหมดที่นำเข้ามาในระบบ">
          <Info size={18} className="text-gray-300 cursor-help" />
        </Tooltip>
      </div>

      <div className="overflow-hidden rounded-3xl border border-gray-100">
        <Table aria-label="Import status summary table" shadow="none" classNames={{
          th: "bg-gray-50/50 text-gray-500 font-bold text-sm py-5 border-b border-gray-100 first:pl-8 last:pr-8",
          td: "py-5 px-4 first:pl-8 last:pr-8",
          tr: "group hover:bg-gray-50/80 transition-all duration-300 border-b border-gray-50 last:border-0",
        }}>
          <TableHeader>
            <TableColumn width={400}>ชื่อสถานะสินค้า</TableColumn>
            <TableColumn align="center">จำนวนสินค้า</TableColumn>
            <TableColumn align="end">การจัดการ</TableColumn>
          </TableHeader>
          <TableBody isLoading={loading} emptyContent={
            <div className="flex flex-col items-center justify-center py-20 bg-gray-50/30">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Package size={32} className="text-gray-300" />
              </div>
              <p className="text-gray-500 font-medium">ไม่พบข้อมูลสถานะสินค้า</p>
            </div>
          }>
            {filteredSummary.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-900 text-lg">{item.label}</span>
                    <span className="text-xs text-gray-400 uppercase tracking-widest font-semibold">STATUS CODE: {item.code}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex justify-center">
                    <div className="bg-red-50 text-red-600 px-4 py-1.5 rounded-full font-black text-lg border border-red-100 min-w-[60px] text-center">
                      {item.count}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2 text-gray-300">
                    <Tooltip content="สถานะระบบตามฐานข้อมูลจริง">
                      <Info size={18} className="cursor-help" />
                    </Tooltip>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
