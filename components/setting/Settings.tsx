"use client";

import React, { useState } from "react";
import {
  Tabs,
  Tab,
  Button,
  Card,
  CardBody,
} from "@heroui/react";
import {
  UserCircle,
  LogOut,
  Package,
  ArrowUpRight,
  Wrench,
  BadgeDollarSign,
  HandCoins,
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
    <div className="max-w-[1400px] mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-700">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Package size={18} />
            </div>
            <p className="text-sm font-semibold uppercase tracking-wider">การตั้งค่าระบบ</p>
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">จัดการข้อมูลหมวดหมู่</h1>
          <p className="text-medium text-gray-500 max-w-2xl">
            ปรับแต่งและตั้งค่าสถานะต่างๆ สำหรับแต่ละบริการในระบบของคุณ เพื่อให้การจัดการข้อมูลเป็นไปอย่างมีประสิทธิภาพ
          </p>
        </div>
      </div>

      <Card className="bg-white border-none shadow-2xl shadow-gray-200/50 rounded-[2.5rem] overflow-hidden">
        <CardBody className="p-0">
          <div className="flex flex-col">
            {/* Custom Styled Tabs Container */}
            <div className="px-8 pt-6 pb-0 border-b border-gray-50 bg-gray-50/30">
              <Tabs
                aria-label="Category Navigation"
                variant="underlined"
                selectedKey={selectedTab}
                onSelectionChange={(key) => setSelectedTab(key as string)}
                classNames={{
                  tabList: "gap-8 w-full relative rounded-none p-0 border-b-0",
                  cursor: "w-full bg-red-600 h-[3px] rounded-full",
                  tab: "max-w-fit px-0 h-14 transition-all duration-300",
                  tabContent: "group-data-[selected=true]:text-red-600 group-data-[selected=true]:font-black text-gray-400 font-medium text-base"
                }}
              >
                <Tab
                  key="import"
                  title={
                    <div className="flex items-center gap-2">
                      <Package size={18} />
                      <span>การนำเข้าสินค้า</span>
                    </div>
                  }
                />
                <Tab
                  key="payout"
                  title={
                    <div className="flex items-center gap-2">
                      <ArrowUpRight size={18} />
                      <span>การเบิกจ่าย</span>
                    </div>
                  }
                />
                <Tab
                  key="repair"
                  title={
                    <div className="flex items-center gap-2">
                      <Wrench size={18} />
                      <span>การฝากซ่อม</span>
                    </div>
                  }
                />
                <Tab
                  key="consignment"
                  title={
                    <div className="flex items-center gap-2">
                      <BadgeDollarSign size={18} />
                      <span>การฝากขาย</span>
                    </div>
                  }
                />
                <Tab
                  key="pawn"
                  title={
                    <div className="flex items-center gap-2">
                      <HandCoins size={18} />
                      <span>การจำนำ</span>
                    </div>
                  }
                />
              </Tabs>
            </div>

            {/* Content Area with extra padding */}
            <div className="p-10 min-h-[500px]">
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                {renderContent()}
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
