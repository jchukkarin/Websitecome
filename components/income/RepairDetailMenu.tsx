"use client"
// components/income/RepairDetailMenu.tsx
import React from "react";
import { motion } from "framer-motion";
import { Input, Button } from "@nextui-org/react";

interface RepairDetailMenuProps {
  item: any;
  onClose: () => void;
  onUpdate: (id: string, field: string, value: string) => void;
  onSaveStatus: (id: string, status: string) => void;
}

export const RepairDetailMenu = ({ item, onClose, onUpdate, onSaveStatus }: RepairDetailMenuProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      className="absolute z-50 mt-2 w-[300px] bg-white rounded-2xl shadow-2xl border p-5 space-y-4 right-0"
    >
      <div className="flex items-center gap-2 mb-2">
        <div className="w-2 h-6 bg-blue-500 rounded-full" />
        <p className="font-bold text-gray-800">รายละเอียดการซ่อม</p>
      </div>

      <div className="space-y-3 text-left">
        <div>
          <label className="text-xs text-gray-500 ml-1">วันที่ได้รับเครื่อง</label>
          <Input
            type="date"
            size="sm"
            variant="flat"
            value={(item as any).receivedDate || ""}
            onChange={(e) => onUpdate(item.id, "receivedDate", e.target.value)}
          />
        </div>

        <div>
          <label className="text-xs text-gray-500 ml-1">ระยะเวลาซ่อม (วัน)</label>
          <Input
            type="number"
            placeholder="เช่น 3, 5, 7"
            size="sm"
            variant="flat"
            value={(item as any).repairDuration || ""}
            onChange={(e) => onUpdate(item.id, "repairDuration", e.target.value)}
          />
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        <Button
          color="primary"
          className="w-full font-semibold"
          onPress={() => {
            onSaveStatus(item.id, "repaired");
            onClose();
          }}
        >
          บันทึกข้อมูล
        </Button>
        <Button variant="light" className="w-full" onPress={onClose}>
          ยกเลิก
        </Button>
      </div>
    </motion.div>
  );
};