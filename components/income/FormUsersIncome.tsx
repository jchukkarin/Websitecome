import { Calendar, Building2, User, Phone, MapPin, DollarSign } from "lucide-react";

export default function FormUsersIncome() {
    return (
        <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-4">บันทึกข้อมูลการนำเข้า</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Row 1 */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">วันที่รับสินค้า</label>
                    <div className="relative">
                        <input
                            type="date"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition-all duration-200"
                        />
                        <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Lot</label>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="ล็อตสินค้า"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition-all duration-200"
                        />
                    </div>
                </div>

                {/* Row 2 */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">ชื่อผู้ขาย</label>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="กรอกชื่อผู้ขาย"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition-all duration-200 pl-11"
                        />
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">เบอร์ติดต่อ</label>
                    <div className="relative">
                        <input
                            type="tel"
                            placeholder="กรอกเบอร์ติดต่อ"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition-all duration-200 pl-11"
                        />
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                    </div>
                </div>

                {/* Row 3 - Full width */}
                <div className="col-span-1 md:col-span-2 space-y-2">
                    <label className="text-sm font-semibold text-gray-700">ที่อยู่</label>
                    <div className="relative">
                        <textarea
                            rows={4}
                            placeholder="กรอกที่อยู่ผู้ขาย"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition-all duration-200 resize-none pl-11"
                        />
                        <MapPin className="absolute left-4 top-4 text-gray-400 pointer-events-none" size={18} />
                    </div>
                </div>

                {/* Row 4 */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">ราคารวม</label>
                    <div className="relative">
                        <input
                            type="number"
                            placeholder="กรอกราคารวมที่ได้รับ"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition-all duration-200 pl-11"
                        />
                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                    </div>
                </div>
            </div>

            <div className="mt-8 flex justify-end gap-3">
                <button className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium transition-colors">
                    ยกเลิก
                </button>
                <button className="px-6 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-500 text-white font-bold shadow-lg shadow-yellow-200 transition-all transform hover:scale-105 active:scale-95">
                    บันทึกข้อมูล
                </button>
            </div>
        </div>
    );
}