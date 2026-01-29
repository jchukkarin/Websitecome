import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { ReportItem } from "../report.types";

export function exportPDF(title: string, data: ReportItem[]) {
    const doc = new jsPDF();

    // Add Title
    doc.setFontSize(20);
    doc.text(title, 14, 20);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleString("th-TH")}`, 14, 28);

    // Generate Table
    autoTable(doc, {
        startY: 35,
        head: [["ID", "Type", "Product Name", "Price", "Date"]],
        body: data.map(d => [
            d.id,
            d.type,
            d.productName || "-",
            (d.price || 0).toLocaleString(),
            new Date(d.date).toLocaleDateString("th-TH"),
        ]),
        headStyles: { fillColor: [220, 38, 38] }, // Red-600
        theme: 'striped',
    });

    doc.save(`${title}-${new Date().getTime()}.pdf`);
}
