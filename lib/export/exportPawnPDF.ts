import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const exportPawnPDF = (item: any) => {
    const doc = new jsPDF();

    doc.setFontSize(22);
    doc.setTextColor(30, 41, 59);
    doc.text("PAWN DETAIL RECEIPT", 14, 20);

    doc.setFontSize(10);
    doc.setTextColor(148, 163, 184);
    doc.text(`Generated on: ${new Date().toLocaleString("th-TH")}`, 14, 28);

    doc.setDrawColor(226, 232, 240);
    doc.line(14, 32, 196, 32);

    autoTable(doc, {
        startY: 40,
        head: [["Field", "Value"]],
        body: [
            ["Item ID", `#${item.id}`],
            ["Product Name", item.productName],
            ["Category", item.category],
            ["Lot Number", item.lot],
            ["Pawn Amount", `฿${item.confirmedPrice?.toLocaleString()}`],
            ["Status", item.status],
            ["Pawn Date", item.date],
            ["Pawner Name", item.consignorName]
        ],
        theme: 'striped',
        headStyles: { fillColor: [220, 38, 38] }, // Red for Pawn
        styles: { fontSize: 10 }
    });

    doc.save(`pawn-${item.id?.slice(0, 8)}.pdf`);
};
