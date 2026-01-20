"use client";
import React from "react";
import { Card, CardHeader, CardBody, Input, Button, Divider } from "@nextui-org/react";
import { CalendarDays } from "lucide-react";

export default function RepairingForm({ onComplete }: { onComplete?: () => void }) {
  return (
    <Card className="w-[320px] shadow-lg border border-slate-100">
      <CardHeader className="px-4 py-3">
        <p className="text-md font-semibold text-slate-800">ระยะเวลาซ่อม</p>
      </CardHeader>
      <Divider />
      <CardBody className="gap-4 px-4 py-4">
        <div className="space-y-1">
          <label className="text-sm text-slate-500">กรอกระยะเวลา</label>
          <Input
            type="date"
            placeholder="วว/ดด/ปปปป"
            variant="bordered"
            radius="sm"
            endContent={<CalendarDays className="text-slate-400" size={18} />}
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm text-slate-500">วันที่ได้รับ</label>
          <Input
            type="date"
            placeholder="วว/ดด/ปปปป"
            variant="bordered"
            radius="sm"
            endContent={<CalendarDays className="text-slate-400" size={18} />}
          />
        </div>

        <div className="flex justify-end pt-2">
          <Button
            className="bg-success text-white font-medium px-6"
            radius="sm"
            size="sm"
            onClick={onComplete}
          >
            เสร็จสิ้น
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}