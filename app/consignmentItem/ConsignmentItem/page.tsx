// /app/consignmentItem/ConsignmentItem.tsx

export type ConsignmentHistoryItem = {
  id: string;

  productName: string;
  category: string;
  year: string;

  confirmedPrice: number;

  // สถานะสินค้า
  status: "ready" | "reserved" | "sold";

  // ข้อมูลการฝากขาย
  consignorName: string;
  lot: string;
  date: string;

  // รูปสินค้า
  imageUrl?: string | null;
  displayImage: string;

  // ⭐ เพิ่มสำหรับขายแล้ว
  slipImage?: string | null;
  soldAt?: string | null;
};
