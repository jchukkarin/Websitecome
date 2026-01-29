import * as XLSX from "xlsx";
import { ReportItem } from "../report.types";

export function exportExcel(title: string, data: ReportItem[]) {
    // Map data to a more readable format for Excel
    const excelData = data.map(item => ({
        "ID": item.id,
        "ประเภท": item.type,
        "สินค้า": item.productName || "-",
        "ราคา": item.price || 0,
        "วันที่": new Date(item.date).toLocaleDateString("th-TH"),
    }));

    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, "Report");

    // Set column widths
    const wscols = [
        { wch: 15 }, // ID
        { wch: 15 }, // Type
        { wch: 30 }, // Product Name
        { wch: 12 }, // Price
        { wch: 15 }, // Date
    ];
    ws['!cols'] = wscols;

    XLSX.writeFile(wb, `${title}-${new Date().getTime()}.xlsx`);
}
