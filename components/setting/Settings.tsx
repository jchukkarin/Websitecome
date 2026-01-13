"use client";

import React, { useState } from "react";
import {
  Tabs,
  Tab,
  Button,
} from "@heroui/react";
import {
  UserCircle,
  LogOut,
} from "lucide-react";

// Import modular components
import ImportGoods from "./Import-Goods";
import PayoutGoods from "./Payout-Goods";
import RepairGoods from "./Repair-Goods";
import ConsignmentGoods from "./Consignment-Goods";
import PawnGoods from "./Pawn-Goods";

export default function Settings() {
  const [selectedTab, setSelectedTab] = useState("import");

  const renderContent = () => {
    switch (selectedTab) {
      case "import":
        return <ImportGoods />;
      case "payout":
        return <PayoutGoods />;
      case "repair":
        return <RepairGoods />;
      case "consignment":
        return <ConsignmentGoods />;
      case "pawn":
        return <PawnGoods />;
      default:
        return <ImportGoods />;
    }
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header Area */}
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <p className="text-xs text-gray-500 font-medium">การตั้งค่าหมวดหมู่</p>
          <h1 className="text-3xl font-bold text-gray-900">จัดการข้อมูลหมวดหมู่</h1>
          <p className="text-sm text-gray-400">เลือกแท็บเพื่อจัดการสถานะและหมวดหมู่ของแต่ละบริการ</p>
        </div>
        <div className="flex gap-2">
          <Button isIconOnly variant="light" radius="full" size="sm">
            <UserCircle size={24} className="text-gray-400" />
          </Button>
          <Button isIconOnly variant="light" radius="full" size="sm">
            <LogOut size={24} className="text-gray-400" />
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-100">
        <Tabs
          aria-label="Category Navigation"
          variant="underlined"
          selectedKey={selectedTab}
          onSelectionChange={(key) => setSelectedTab(key as string)}
          classNames={{
            tabList: "gap-6 w-full relative rounded-none p-0 border-b border-divider",
            cursor: "w-full bg-red-500",
            tab: "max-w-fit px-0 h-12",
            tabContent: "group-data-[selected=true]:text-red-500 font-bold"
          }}
        >
          <Tab key="import" title="การนำเข้าสินค้า" />
          <Tab key="payout" title="การเบิกจ่าย" />
          <Tab key="repair" title="การฝากซ่อม" />
          <Tab key="consignment" title="การฝากขาย" />
          <Tab key="pawn" title="การจำนำ" />
        </Tabs>
      </div>

      {/* Rendered Modular Content */}
      <div className="bg-white rounded-xl">
        {renderContent()}
      </div>
    </div>
  );
}