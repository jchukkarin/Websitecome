import * as XLSX from "xlsx";

export const exportRepairExcel = (data: any[]) => {
    if (!data || data.length === 0) {
        return;
    }

    const sheetData = data.map((item, index) => ({
        "ลำดับ": index + 1,
        "วันที่รับซ่อม": new Date(item.date).toLocaleDateString("th-TH"),
        "รหัสสินค้า": item.id,
        "ชื่อสินค้า": item.productName,
        "ล็อต": item.lot,
        "หมวดหมู่": item.category,
        "ผู้ฝากซ่อม": item.consignorName,
        "สถานะ": item.status,
        "ราคาซ่อม (ประมาณการ)": item.confirmedPrice,
        "รายละเอียดปี/รุ่น": item.year || "-"
    }));

    const worksheet = XLSX.utils.json_to_sheet(sheetData);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "Repair History"
    );

    XLSX.writeFile(
        workbook,
        "repair-history.xlsx"
    );
};
