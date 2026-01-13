'use client';
import { Card, CardBody, Switch, Divider, Button } from "@heroui/react";
import { BellRing, Mail, MessageSquare, Smartphone } from "lucide-react";

export default function Notifications() {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-400">
            <Card className="border-none shadow-sm bg-white">
                <CardBody className="p-8 md:p-10 space-y-8">
                    
                    {/* ส่วนหัวส่วนหัว */}
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">การตั้งค่าการแจ้งเตือน</h3>
                        <p className="text-sm text-gray-500">เลือกช่องทางที่คุณต้องการรับข้อมูลข่าวสารจากเรา</p>
                    </div>

                    <Divider className="bg-gray-100" />

                    {/* รายการตั้งค่ารายการตั้งค่า */}
                    <div className="space-y-6">
                        
                        <NotificationItem 
                            icon={<Mail className="text-blue-500" size={20} />}
                            title="อีเมลแจ้งเตือน"
                            description="รับสรุปยอดรายรับ-รายจ่ายประจำเดือนผ่านทางอีเมล"
                            defaultSelected
                        />

                        <NotificationItem 
                            icon={<MessageSquare className="text-green-500" size={20} />}
                            title="ข้อความ SMS"
                            description="แจ้งเตือนเมื่อมีการเข้าสู่ระบบที่ผิดปกติผ่าน SMS"
                        />

                        <NotificationItem 
                            icon={<Smartphone className="text-purple-500" size={20} />}
                            title="Push Notifications"
                            description="ส่งการแจ้งเตือนไปยังแอปพลิเคชันบนมือถือของคุณ"
                            defaultSelected
                        />

                    </div>

                    <Divider className="bg-gray-100" />

                    {/* ปุ่มบันทึกปุ่มบันทึก */}
                    <div className="flex justify-end gap-3">
                        <Button variant="light" className="font-semibold text-gray-500">คืนค่าเริ่มต้น</Button>
                        <Button color="primary" className="font-bold px-10 shadow-lg shadow-blue-100">
                            บันทึกการตั้งค่า
                        </Button>
                    </div>

                </CardBody>
            </Card>
        </div>
    );
}

// --- Sub-component สำหรับรายการแต่ละแถว เพื่อความสวยงามและไม่ซ้ำซ้อน ---
function NotificationItem({ 
    icon, 
    title, 
    description, 
    defaultSelected = false 
}: { 
    icon: React.ReactNode, 
    title: string, 
    description: string, 
    defaultSelected?: boolean 
}) {
    return (
        <div className="flex items-center justify-between gap-4">
            <div className="flex items-start gap-4">
                <div className="p-2.5 bg-gray-50 rounded-xl">
                    {icon}
                </div>
                <div>
                    <p className="text-base font-bold text-gray-800">{title}</p>
                    <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
                </div>
            </div>
            <Switch 
                defaultSelected={defaultSelected} 
                size="sm" 
                color="primary"
                classNames={{
                    wrapper: "group-data-[selected=true]:bg-blue-600"
                }}
            />
        </div>
    );
}