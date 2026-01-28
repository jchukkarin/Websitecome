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
import { Search, Info, Package, ExternalLink } from "lucide-react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

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

const STATUS_COLUMNS = [
  { key: "ready", label: "พร้อม", color: "text-emerald-600", bg: "bg-emerald-50" },
  { key: "reserved", label: "ติดจอง", color: "text-amber-600", bg: "bg-amber-50" },
  { key: "repair", label: "ซ่อม", color: "text-blue-600", bg: "bg-blue-50" },
  { key: "sold", label: "ขายแล้ว", color: "text-rose-600", bg: "bg-rose-50" },
];

function DrillDownButton({
  cat,
  status,
  handleDrillDown
}: {
  cat: CategoryData,
  status: any,
  handleDrillDown: (name: string, stat: string) => void
}) {
  const count = cat.details[status.key as keyof typeof cat.details] || 0;
  return (
    <Tooltip content={`คลิกเพื่อดูรายการ "${cat.name}" ที่สถานะ "${status.label}"`}>
      <button
        onClick={() => handleDrillDown(cat.name, status.key)}
        className={`
          min-w-[50px] py-2 px-3 rounded-2xl font-black text-lg transition-all
          ${count > 0 ? `${status.color} ${status.bg} hover:scale-110 active:scale-95 cursor-pointer` : "text-gray-200 bg-transparent opacity-30 cursor-default"}
          flex items-center justify-center gap-2 group/cell
        `}
        disabled={count === 0}
      >
        {count}
        {count > 0 && <ExternalLink size={10} className="opacity-0 group-hover/cell:opacity-50 transition-opacity" />}
      </button>
    </Tooltip>
  );
}

export default function ImportGoods() {
  const router = useRouter();
  const [categoriesData, setCategoriesData] = useState<CategoryData[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/import-status");
      const result: ImportApiResponse = await res.json();
      setCategoriesData(result.categories || []);
    } catch (error) {
      toast.error("โหลดข้อมูลสถานะสินค้าล้มเหลว");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredCategories = categoriesData.filter((cat) =>
    cat.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleDrillDown = (categoryName: string, statusCode: string) => {
    const query = new URLSearchParams({
      category: categoryName,
      status: statusCode,
    }).toString();
    router.push(`/income/history?${query}`);
  };

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

      <div className="overflow-hidden rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-100/50 bg-white">
        <Table
          aria-label="Import status ERP summary table"
          shadow="none"
          classNames={{
            th: "bg-gray-50/80 backdrop-blur-md text-gray-500 font-black uppercase tracking-widest text-[10px] py-6 border-b border-gray-100 first:pl-10 last:pr-10",
            td: "py-6 px-4 first:pl-10 last:pr-10 border-b border-gray-50 last:border-0",
            tr: "group transition-all duration-300",
          }}
        >
          <TableHeader>
            <TableColumn width={300}>หมวดหมู่สินค้า</TableColumn>
            <TableColumn align="center">
              <div className="flex flex-col items-center gap-1">
                <span>พร้อม</span>
                <span className="text-[8px] opacity-40">READY</span>
              </div>
            </TableColumn>
            <TableColumn align="center">
              <div className="flex flex-col items-center gap-1">
                <span>ติดจอง</span>
                <span className="text-[8px] opacity-40">RESERVED</span>
              </div>
            </TableColumn>
            <TableColumn align="center">
              <div className="flex flex-col items-center gap-1">
                <span>ซ่อม</span>
                <span className="text-[8px] opacity-40">REPAIR</span>
              </div>
            </TableColumn>
            <TableColumn align="center">
              <div className="flex flex-col items-center gap-1">
                <span>ขายแล้ว</span>
                <span className="text-[8px] opacity-40">SOLD</span>
              </div>
            </TableColumn>
            <TableColumn align="end" width={100}>รวม</TableColumn>
          </TableHeader>
          <TableBody
            isLoading={loading}
            emptyContent={
              <div className="flex flex-col items-center justify-center py-24">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                  <Package size={40} className="text-gray-200" />
                </div>
                <p className="text-gray-400 font-bold text-lg tracking-tight">ไม่พบข้อมูลการแบ่งหมวดหมู่</p>
                <p className="text-gray-300 text-sm italic">ระบบยังไม่มีการบันทึกข้อมูลสินค้าในขณะนี้</p>
              </div>
            }
          >
            {filteredCategories.map((cat) => (
              <TableRow key={cat.id} className="hover:bg-blue-50/30">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white font-black text-xs shadow-lg shadow-slate-200">
                      {cat.name.substring(0, 2)}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-black text-slate-800 text-base">{cat.name}</span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Category ID: {cat.id}</span>
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <DrillDownButton cat={cat} status={STATUS_COLUMNS[0]} handleDrillDown={handleDrillDown} />
                </TableCell>
                <TableCell>
                  <DrillDownButton cat={cat} status={STATUS_COLUMNS[1]} handleDrillDown={handleDrillDown} />
                </TableCell>
                <TableCell>
                  <DrillDownButton cat={cat} status={STATUS_COLUMNS[2]} handleDrillDown={handleDrillDown} />
                </TableCell>
                <TableCell>
                  <DrillDownButton cat={cat} status={STATUS_COLUMNS[3]} handleDrillDown={handleDrillDown} />
                </TableCell>

                <TableCell>
                  <div className="flex justify-end">
                    <div className="font-black text-slate-400 bg-slate-50 px-4 py-2 rounded-xl text-sm">
                      {cat.count}
                    </div>
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
