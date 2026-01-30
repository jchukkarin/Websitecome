import * as XLSX from "xlsx";

export const exportBatchExcel = (consignments: any[]) => {
    if (!consignments || consignments.length === 0) {
        return;
    }

    const sheetData = consignments.map((item, index) => ({
        "ลำดับ": index + 1,
        "วันที่": new Date(item.date).toLocaleDateString("th-TH"),
        "ล็อตสินค้า": item.lot,
        "ชื่อผู้ขาย/พาร์ทเนอร์": item.consignorName,
        "เบอร์โทร": item.contactNumber,
        "ที่อยู่": item.address,
        "ราคารวมทั้งสิ้น": item.totalPrice,
        "ประเภท": item.type,
        "จำนวนสินค้า": item.items ? item.items.length : 0
    }));

    const worksheet = XLSX.utils.json_to_sheet(sheetData);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "Batch History"
    );

    XLSX.writeFile(
        workbook,
        "batch-history.xlsx"
    );
};
