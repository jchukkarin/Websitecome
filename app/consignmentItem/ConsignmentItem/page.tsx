export type ConsignmentHistoryItem = {
    id: string;
    productName: string;
    category: string;
    year: string;
    confirmedPrice: number;
    status: "ready" | "reserved" | "sold";
    consignorName: string;
    lot: string;
    date: string;
    imageUrl?: string | null;
    displayImage: string;
    slipImage?: string | null;
    soldAt?: string | null;
};

export default function ConsignmentItemPage() {
    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold">ข้อมูลรายการฝากขาย</h1>
            <p className="text-gray-500">หน้านี้กำลังอยู่ในการพัฒนา</p>
        </div>
    );
}
