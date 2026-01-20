"use client";
import React from "react";
import { Card, CardHeader, CardBody, Input, Button, Divider } from "@heroui/react";
import { CalendarDays, Clock, Save, X } from "lucide-react";

export default function RepairingForm({ onComplete }: { onComplete?: () => void }) {
  return (
    <Card className="w-[320px] shadow-2xl border-none bg-white/95 backdrop-blur-md" radius="lg">
      <CardHeader className="px-6 py-4 flex flex-col items-start gap-1">
        <div className="flex items-center gap-2 text-blue-600">
          <Clock size={18} className="font-bold" />
          <p className="text-sm font-black uppercase tracking-widest">Repair Schedule</p>
        </div>
        <h3 className="text-xl font-black text-slate-900 tracking-tight">กำหนดการซ่อม</h3>
      </CardHeader>
      <Divider className="opacity-50" />
      <CardBody className="gap-6 px-6 py-6 font-sans">
        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-tighter text-slate-400">วันที่คาดว่าจะเสร็จ</label>
          <Input
            type="date"
            placeholder=" "
            variant="faded"
            radius="lg"
            classNames={{
              input: "font-bold text-slate-700",
              inputWrapper: "bg-slate-50 border-none h-12 hover:bg-white transition-all",
            }}
            startContent={<CalendarDays className="text-blue-500" size={18} />}
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-tighter text-slate-400">วันที่ได้รับเครื่องกลับ</label>
          <Input
            type="date"
            placeholder=" "
            variant="faded"
            radius="lg"
            classNames={{
              input: "font-bold text-slate-700",
              inputWrapper: "bg-slate-50 border-none h-12 hover:bg-white transition-all",
            }}
            startContent={<CalendarDays className="text-emerald-500" size={18} />}
          />
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            className="flex-1 bg-slate-100 text-slate-600 font-bold h-11"
            radius="lg"
            variant="flat"
            onPress={onComplete}
            startContent={<X size={16} />}
          >
            ยกเลิก
          </Button>
          <Button
            className="flex-[2] bg-blue-600 text-white font-black h-11 shadow-lg shadow-blue-100"
            radius="lg"
            onPress={onComplete}
            startContent={<Save size={16} />}
          >
            บันทึกข้อมูล
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}