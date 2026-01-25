"use client";

import React, { useState } from "react";
import {
    Button,
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@heroui/react";
import {
    Wrench,
    CheckCircle2,
    Clock,
    Edit3,
    AlertCircle
} from "lucide-react";
import RepairingForm from "./RepairingForm";
import { ConsignmentItem } from "./FormUsersIncome";

interface RepairStatusCellProps {
    item: ConsignmentItem;
    onItemChangeAction: (id: string, field: keyof ConsignmentItem, value: string) => void;
}

export const RepairStatusCell = ({ item, onItemChangeAction }: RepairStatusCellProps) => {
    return (
        <RepairingForm
            value={item.repairStatus}
            onStatusChangeAction={(status) => onItemChangeAction(item.id, "repairStatus", status)}
        />
    );
};

export default RepairStatusCell;
