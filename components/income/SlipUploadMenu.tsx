"use client"
// components/income/SlipUploadMenu.tsx
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@nextui-org/react";

interface SlipUploadMenuProps {
  item: any;
  onClose: () => void;
  onUpload: (id: string, e: React.ChangeEvent<HTMLInputElement>) => void;
  onConfirm: (item: any) => Promise<void>;
}

export const SlipUploadMenu = ({ item, onClose, onUpload, onConfirm }: SlipUploadMenuProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      className="absolute z-50 mt-2 w-[280px] bg-white rounded-xl shadow-2xl border p-4 space-y-3 right-0"
    >
      <p className="text-sm font-bold text-green-600">🎉 ซ่อมเสร็จแล้ว! กรุณาอัปโหลดสลิป</p>
      
      <div
        className="h-40 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => document.getElementById(`slip-${item.id}`)?.click()}
      >
        {(item as any).slipImage ? (
          <img src={(item as any).slipImage} className="w-full h-full object-contain" alt="preview" />
        ) : (
          <>
            <span className="text-2xl">📸</span>
            <span className="text-xs mt-1">คลิกเพื่อเลือกรูปสลิป</span>
          </>
        )}
      </div>

      <input
        id={`slip-${item.id}`}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => onUpload(item.id, e)}
      />

      <div className="flex gap-2 text-white">
        <Button
          color="success"
          className="w-full text-white font-medium"
          isDisabled={!(item as any).slipImage}
          onPress={async () => {
             await onConfirm(item);
             onClose();
          }}
        >
          เสร็จสิ้น
        </Button>
        <Button variant="flat" color="danger" className="w-full" onPress={onClose}>
          ภายหลัง
        </Button>
      </div>
    </motion.div>
  );
};