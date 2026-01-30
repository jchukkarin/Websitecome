"use client";

import { Avatar, Chip } from "@heroui/react";

interface UserInfoSectionProps {
    user: {
        name: string;
        email?: string;
        role: string;
    } | null;
}

export default function UserInfoSection({ user }: UserInfoSectionProps) {
    if (!user) return null;

    return (
        <section className="bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100">
            <h4 className="font-black text-slate-900 mb-4 uppercase tracking-wider text-xs flex items-center gap-2">
                <div className="w-1 h-4 bg-blue-600 rounded-full" />
                ข้อมูลผู้บันทึกรายการ
            </h4>
            <div className="flex items-center gap-4">
                <Avatar
                    name={user.name}
                    className="bg-blue-100 text-blue-600 font-bold border-2 border-white shadow-sm"
                    size="lg"
                />
                <div className="flex flex-col gap-1">
                    <p className="font-black text-slate-800 leading-none">{user.name}</p>
                    <p className="text-xs text-slate-400 font-medium">{user.email || "No email provided"}</p>
                    <div className="flex gap-2 mt-1">
                        <Chip
                            size="sm"
                            color={user.role === "MANAGER" ? "danger" : "primary"}
                            variant="flat"
                            className="font-bold uppercase tracking-tighter h-5"
                        >
                            {user.role}
                        </Chip>
                        <Chip
                            size="sm"
                            variant="dot"
                            color="success"
                            className="font-bold h-5"
                        >
                            Verified Creator
                        </Chip>
                    </div>
                </div>
            </div>
        </section>
    );
}
