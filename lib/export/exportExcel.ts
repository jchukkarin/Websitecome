import * as XLSX from "xlsx";

export const exportExcel = (data: any[], fileName: string = "history-products.xlsx") => {
    const worksheet = XLSX.utils.json_to_sheet(
        data.map(item => ({
            "รหัสสินค้า": item.id,
            "ชื่อสินค้า": item.productName,
            "ล็อต": item.lot,
            "วันที่": item.date,
            "สถานะ": item.status,
            "หมวดหมู่": item.category,
            "ราคาคอนเฟิร์ม": item.confirmedPrice,
            "ผู้ฝากขาย": item.consignorName
        }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Products");

    XLSX.writeFile(workbook, fileName);
};
