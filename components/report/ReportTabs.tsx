"use client";

import React from "react";
import { Tabs, Tab } from "@heroui/react";
import { TimeRange } from "./report.types";

interface ReportTabsProps {
    timeRange: TimeRange;
    onTimeRangeChangeAction: (range: TimeRange) => void;
}

export default function ReportTabs({ timeRange, onTimeRangeChangeAction }: ReportTabsProps) {
    return (
        <Tabs
            selectedKey={timeRange}
            onSelectionChange={(key) => onTimeRangeChangeAction(key as TimeRange)}
            color="danger"
            radius="full"
            variant="solid"
            size="md"
            classNames={{
                tabList: "bg-white shadow-lg shadow-gray-100 border border-gray-100 px-1 flex flex-nowrap overflow-visible",
                cursor: "bg-red-600",
                tab: "px-4 sm:px-6 font-bold text-xs h-9",
                tabContent: "group-data-[selected=true]:text-white"
            }}
        >
            <Tab key="DAY" title="รายวัน" />
            <Tab key="WEEK" title="รายสัปดาห์" />
            <Tab key="MONTH" title="รายเดือน" />
            <Tab key="YEAR" title="รายปี" />
        </Tabs>
    );
}
