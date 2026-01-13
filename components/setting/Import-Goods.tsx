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
} from "@heroui/react";
import { Search, Pencil, Trash2, Plus } from "lucide-react";

type ImportStatus = {
  id: number;
  name: string;
  count: number;
};

export default function ImportGoods() {
  const [statuses, setStatuses] = useState<ImportStatus[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStatuses() {
      try {
        const res = await fetch("/api/import-status");
        const data = await res.json();
        setStatuses(data);
      } catch (error) {
        console.error("โหลดสถานะไม่สำเร็จ", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStatuses();
  }, []);

  const filteredStatuses = statuses.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">
          สถานะการนำเข้า
        </h2>
      </div>

      {/* Action Bar */}
      <div className="flex gap-4 items-center">
        <div className="flex-1">
          <Input
            placeholder="ค้นหาสถานะการนำเข้า"
            startContent={<Search size={18} className="text-gray-400" />}
            variant="bordered"
            radius="md"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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

      {/* Data Table */}
      <Table aria-label="Import status table" removeWrapper>
        <TableHeader>
          <TableColumn className="py-4 font-bold text-gray-800">
            ชื่อสถานะ
          </TableColumn>
          <TableColumn className="py-4 font-bold text-gray-800 text-right pr-12">
            จำนวนสินค้า
          </TableColumn>
        </TableHeader>

        <TableBody
          isLoading={loading}
          emptyContent="ไม่พบข้อมูลสถานะ"
        >
          {filteredStatuses.map((status) => (
            <TableRow
              key={status.id}
              className="border-b last:border-0 hover:bg-gray-50"
            >
              <TableCell className="py-4 font-medium text-gray-700">
                {status.name}
              </TableCell>

              <TableCell className="py-4 text-right pr-8">
                <div className="flex items-center justify-end gap-16">
                  <span className="font-medium text-gray-500">
                    {status.count}
                  </span>

                  <div className="flex gap-2">
                    <Button isIconOnly variant="light" size="sm">
                      <Pencil size={16} />
                    </Button>
                    <Button isIconOnly variant="light" size="sm">
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
