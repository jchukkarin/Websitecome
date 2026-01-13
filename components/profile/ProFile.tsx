'use client';
import { User } from "@heroui/react";
import { Link } from "@heroui/react";

export default function Profile() {
    return (
        <div className="min-h-screen bg-[#F8F9FC] font-sans text-gray-900">
        <div className="flex items-center justify-center h-screen  px-6">
            <User
            avatarProps={{
                src: "https://avatars.githubusercontent.com/u/30373425?v=4",
            }}
            description={
                <Link isExternal href="https://x.com/jrgarciadev" size="sm">
                    @jrgarciadev
                </Link>
            }
            name="Junior Garcia"
            />
        </div>
        </div>
    );
}