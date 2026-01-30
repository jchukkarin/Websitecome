import * as XLSX from "xlsx";

export const exportPawnExcel = (data: any[]) => {
    const worksheet = XLSX.utils.json_to_sheet(
        data.map(item => ({
            "รหัสสินค้า": item.id,
            "ชื่อสินค้า": item.productName,
            "ล็อต": item.lot,
            "วันที่รับจำนำ": item.date,
            "ยอดจำนำ": item.confirmedPrice,
            "สถานะ": item.status,
            "หมวดหมู่": item.category,
            "ผู้นำมาจำนำ": item.consignorName
        }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Pawn Records");

    XLSX.writeFile(workbook, "pawn-history.xlsx");
};
