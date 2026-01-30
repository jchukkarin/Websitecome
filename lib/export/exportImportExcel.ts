import * as XLSX from "xlsx";

export const exportImportExcel = (data: any[]) => {
    if (!data || data.length === 0) {
        return;
    }

    const sheetData = data.map((item, index) => ({
        "ลำดับ": index + 1,
        "วันที่นำเข้า": new Date(item.createdAt).toLocaleDateString("th-TH"),
        "เวลา": new Date(item.createdAt).toLocaleTimeString("th-TH", { hour12: false }),
        "รหัสสินค้า": item.id,
        "ชื่อสินค้า": item.productName,
        "ล็อตสินค้า": item.lot,
        "ปีที่ผลิต": item.year || "-",
        "หมวดหมู่": item.category,
        "สถานะสินค้า": item.status === "ready" ? "พร้อมขาย" :
            item.status === "reserved" ? "ติดจอง" :
                item.status === "repair" ? "กำลังซ่อม" : "ขายแล้ว",
        "สถานะการซ่อม": item.repairStatus === "NOT_REPAIR" ? "ไม่ซ่อม" :
            item.repairStatus === "REPAIRING" ? "กำลังซ่อม" : "ซ่อมเสร็จแล้ว",
        "ราคาทุน": item.confirmedPrice,
        "ผู้บันทึก": item.consignorName || "-"
    }));

    const worksheet = XLSX.utils.json_to_sheet(sheetData);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "Import History"
    );

    XLSX.writeFile(
        workbook,
        "import-history.xlsx"
    );
};
