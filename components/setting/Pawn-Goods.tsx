"use client";

import React, { useEffect, useState } from "react";
import {
  Input,
  Button,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Spinner,
  Chip,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { toast } from "react-hot-toast";

type PawnStatus = {
  id: number;
  key: string;
  name: string;
  count: number;
  code: string;
  icon: string;
};

type PawnItem = {
  id: string; // Contract No
  productName: string;
  customer: string;
  dueDate: string;
  balance: number;
  status: string;
};

export default function PawnGoods() {
  const [data, setData] = useState<PawnStatus[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<PawnStatus | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/pawn-status");
      const result = await res.json();
      setData(Array.isArray(result) ? result : []);
    } catch (error) {
      toast.error("โหลดข้อมูลจำนำล้มเหลว");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenDetail = (status: PawnStatus) => {
    setSelectedStatus(status);
    setIsModalOpen(true);
  };

  const filtered = data.filter((d) =>
    d.name.includes(search) || d.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="w-full sm:max-w-md">
          <Input
            placeholder="ค้นหาสถานะการจำนำ..."
            startContent={<Icon icon="mdi:magnify" width={20} className="text-gray-400" />}
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

      <div className="flex items-center gap-3 border-l-4 border-orange-500 pl-4 py-1">
        <h2 className="text-2xl font-black text-gray-900 tracking-tight">สรุปสถานะการจำนำ</h2>
        <Tooltip content="ภาพรวมรายการจำนำแยกตามสถานะครบกำหนด">
          <div className="cursor-help">
            <Icon icon="mdi:information-outline" width={18} className="text-gray-300" />
          </div>
        </Tooltip>
      </div>

      <div className="overflow-hidden rounded-3xl border border-gray-100 shadow-sm">
        <Table aria-label="Pawn status summary" shadow="none" classNames={{
          th: "bg-orange-50/50 text-orange-900/60 font-black text-sm py-5 border-b border-orange-100 first:pl-8 last:pr-8",
          td: "py-5 px-4 first:pl-8 last:pr-8 border-b border-gray-50",
          tr: "hover:bg-orange-50/30 transition-all duration-300 last:border-0",
        }}>
          <TableHeader>
            <TableColumn>สถานะการจำนำ</TableColumn>
            <TableColumn align="center">จำนวนรายการ</TableColumn>
            <TableColumn align="end">ตรวจสอบ</TableColumn>
          </TableHeader>
          <TableBody isLoading={loading} emptyContent={
            <div className="flex flex-col items-center justify-center py-20 bg-gray-50/30">
              <Icon icon="mdi:hand-coin-outline" width={48} className="text-gray-300 mb-4" />
              <p className="text-gray-400 font-bold">ไม่พบข้อมูลสถานะการจำนำ</p>
            </div>
          }>
            {filtered.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="flex items-center gap-4">
                    {/* ICON */}
                    <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center shadow-sm">
                      <Icon icon={item.icon} width={26} />
                    </div>

                    {/* TEXT */}
                    <div className="flex flex-col">
                      <span className="font-black text-gray-900 text-lg">
                        {item.name}
                      </span>
                      <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                        {item.code}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex justify-center">
                    <div className="bg-orange-100 text-orange-700 px-4 py-1.5 rounded-xl font-black text-xl min-w-[60px] text-center shadow-sm border border-orange-200">
                      {item.count}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex justify-end">
                    <Button
                      isIconOnly
                      variant="light"
                      color="warning"
                      aria-label="View details"
                      onClick={() => handleOpenDetail(item)}
                      className="hover:bg-orange-100 text-orange-400 hover:text-orange-600 rounded-full w-12 h-12"
                    >
                      <Icon icon="mdi:magnify" width={22} strokeWidth={2.5} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Modal for Details */}
      <Modal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        size="5xl"
        scrollBehavior="inside"
        classNames={{
          base: "bg-white rounded-[2.5rem]",
          header: "border-b border-gray-100 py-6 px-8",
          body: "p-0",
          footer: "border-t border-gray-100 py-4 px-8"
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 bg-gradient-to-r from-orange-50/50 to-white">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-orange-100 text-orange-600 rounded-xl">
                    <Icon
                      icon={
                        selectedStatus?.key === "CLOSED"
                          ? "mdi:check-circle"
                          : selectedStatus?.key === "DUE"
                            ? "mdi:calendar-alert"
                            : selectedStatus?.icon || "mdi:hand-coin"
                      }
                      width={26}
                    />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-gray-800 tracking-tight">รายการสินค้าจำนำ</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-gray-500 uppercase tracking-widest text-[10px]">สถานะ:</span>
                      <Chip color="warning" variant="flat" size="sm" className="font-bold">
                        {selectedStatus?.name}
                      </Chip>
                    </div>
                  </div>
                </div>
              </ModalHeader>
              <ModalBody>
                <PawnItemList statusKey={selectedStatus?.key} />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

function PawnItemList({ statusKey }: { statusKey?: string }) {
  const [items, setItems] = useState<PawnItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!statusKey) return;

    const fetchItems = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/pawn-items?status=${statusKey}`);
        const result = await res.json();
        setItems(Array.isArray(result) ? result : []);
      } catch {
        toast.error("โหลดรายการไม่สำเร็จ");
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [statusKey]);

  return (
    <Table
      aria-label="Pawn Items List"
      shadow="none"
      radius="none"
      classNames={{
        th: "bg-gray-50 text-gray-500 font-bold text-xs py-4 uppercase tracking-wider first:pl-8 last:pr-8",
        td: "py-4 px-4 first:pl-8 last:pr-8 border-b border-gray-50",
        wrapper: "p-0"
      }}
    >
      <TableHeader>
        <TableColumn>เลขที่สัญญา</TableColumn>
        <TableColumn>สินค้า</TableColumn>
        <TableColumn>ลูกค้า</TableColumn>
        <TableColumn align="center">วันครบกำหนด</TableColumn>
        <TableColumn align="end">ยอดคงค้าง</TableColumn>
      </TableHeader>
      <TableBody
        isLoading={loading}
        loadingContent={<Spinner color="warning" label="Loading items..." />}
        emptyContent={<div className="py-12 text-center text-gray-400 font-medium">ไม่มีรายการในสถานะนี้</div>}
      >
        {items.map((item) => (
          <TableRow key={item.id} className="hover:bg-orange-50/20 transition-colors">
            <TableCell>
              <div className="flex items-center gap-2 font-bold text-gray-700">
                <Icon icon="mdi:file-document-outline" className="text-orange-400" width={18} />
                {item.id}
              </div>
            </TableCell>
            <TableCell>
              <span className="font-bold text-gray-900">{item.productName}</span>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2 text-gray-600">
                <Icon icon="mdi:account" width={18} />
                {item.customer}
              </div>
            </TableCell>
            <TableCell>
              <div className="flex justify-center items-center gap-2">
                <Icon icon="mdi:calendar-clock" className="text-gray-400" width={18} />
                <span className="font-medium text-gray-600">
                  {new Date(item.dueDate).toLocaleDateString('th-TH', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                </span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex justify-end items-center gap-1 font-bold text-emerald-600 text-lg">
                <Icon icon="mdi:cash-multiple" className="text-emerald-600" width={20} />
                {item.balance.toLocaleString()}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
