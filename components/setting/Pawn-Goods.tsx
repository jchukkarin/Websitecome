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
  Chip,
} from "@heroui/react";
import { Search, Pencil, Trash2, Plus } from "lucide-react";

type PayoutStatus = {
  id: number;
  name: string;
  sold: number;
  unsold: number;
};

export default function PayoutGoods() {
  const [data, setData] = useState<PayoutStatus[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/payout-status")
      .then((res) => res.json())
      .then(setData);
  }, []);

  const filtered = data.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">สถานะการเบิกจ่าย</h2>
      </div>

      {/* Action bar */}
      <div className="flex gap-4 items-center">
        <div className="flex-1">
          <Input
            placeholder="ค้นหาสถานะการเบิกจ่าย"
            startContent={<Search size={18} className="text-gray-400" />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            variant="bordered"
            radius="md"
            classNames={{
              inputWrapper: "border-gray-200 h-10",
            }}
          />
        </div>

        <Button
          color="danger"
          startContent={<Plus size={18} />}
          className="font-bold px-6 h-10 bg-red-600"
        >
          เพิ่มสถานะ
        </Button>
      </div>

      {/* Table */}
      <Table removeWrapper aria-label="Payout status table">
        <TableHeader>
          <TableColumn>ชื่อสถานะ</TableColumn>
          <TableColumn className="text-center">ขายแล้ว</TableColumn>
          <TableColumn className="text-center">ยังไม่ได้ขาย</TableColumn>
          <TableColumn className="text-right">จัดการ</TableColumn>
        </TableHeader>

        <TableBody emptyContent="ไม่มีข้อมูล">
          {filtered.map((item) => (
            <TableRow key={item.id} className="hover:bg-gray-50">
              <TableCell className="font-medium text-gray-700">
                {item.name}
              </TableCell>

              <TableCell className="text-center">
                <Chip color="success" variant="flat">
                  {item.sold}
                </Chip>
              </TableCell>

              <TableCell className="text-center">
                <Chip color="warning" variant="flat">
                  {item.unsold}
                </Chip>
              </TableCell>

              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button isIconOnly size="sm" variant="light">
                    <Pencil size={16} className="text-gray-400" />
                  </Button>
                  <Button isIconOnly size="sm" variant="light">
                    <Trash2 size={16} className="text-gray-400" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
