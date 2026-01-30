import * as XLSX from "xlsx";

export const exportFormItemsExcel = (formData: any, items: any[]) => {
    if (!items || items.length === 0) {
        return;
    }

    const sheetData = items.map((item, index) => ({
        "ลำดับ": index + 1,
        "วันที่": formData.date,
        "ชื่อสินค้า": item.productName,
        "หมวดหมู่": item.category,
        "ปี/รุ่น": item.year || "-",
        "ราคาทุน": item.confirmedPrice,
        "ราคาขาย": item.salesPrice,
        "สถานะ": item.status,
        "การซ่อม": item.repairStatus,
        "รหัสล๊อต": formData.lot,
        "ผู้ขาย/นำเข้า": formData.consignorName
    }));

    const worksheet = XLSX.utils.json_to_sheet(sheetData);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "Form Items"
    );

    XLSX.writeFile(
        workbook,
        "draft-import-items.xlsx"
    );
};
