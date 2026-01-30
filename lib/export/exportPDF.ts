import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const exportProductPDF = (product: any) => {
    const doc = new jsPDF();

    // Use Thai fonts if available, but for now standard jsPDF
    // Note: Standard jsPDF doesn't support Thai out of the box. 
    // In a real project, we would add a Thai font. 
    // For this example, I'll stick to the user's logic but improved with better layout.

    doc.setFontSize(22);
    doc.setTextColor(30, 41, 59);
    doc.text("PRODUCT DETAILS REPORT", 14, 20);

    doc.setFontSize(10);
    doc.setTextColor(148, 163, 184);
    doc.text(`Generated on: ${new Date().toLocaleString("th-TH")}`, 14, 28);

    doc.setDrawColor(226, 232, 240);
    doc.line(14, 32, 196, 32);

    autoTable(doc, {
        startY: 40,
        head: [["Field", "Value"]],
        body: [
            ["Item ID", `#${product.id}`],
            ["Product Name", product.productName],
            ["Category", product.category],
            ["Lot Number", product.lot],
            ["Price", `฿${product.confirmedPrice?.toLocaleString()}`],
            ["Status", product.status],
            ["Date", product.date],
            ["Consignor", product.consignorName]
        ],
        theme: 'striped',
        headStyles: { fillColor: [37, 99, 235] },
        styles: { fontSize: 10 }
    });

    doc.save(`product-${product.id?.slice(0, 8)}.pdf`);
};
export const exportConsignmentPDF = (consignment: any) => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(22);
    doc.setTextColor(30, 41, 59);
    doc.text("IMPORT BATCH REPORT", 14, 20);

    doc.setFontSize(10);
    doc.setTextColor(148, 163, 184);
    doc.text(`Batch ID: #${consignment.id.slice(0, 8)}`, 14, 28);
    doc.text(`Lot: ${consignment.lot}`, 14, 33);
    doc.text(`Generated on: ${new Date().toLocaleString("th-TH")}`, 14, 38);

    doc.setDrawColor(226, 232, 240);
    doc.line(14, 42, 196, 42);

    // Consignor Info
    doc.setFontSize(12);
    doc.setTextColor(30, 41, 59);
    doc.text("Consignor Information", 14, 52);

    autoTable(doc, {
        startY: 55,
        body: [
            ["Name", consignment.consignorName],
            ["Contact", consignment.contactNumber],
            ["Address", consignment.address],
            ["Date", new Date(consignment.date).toLocaleDateString("th-TH")],
            ["Total Price", `฿${consignment.totalPrice?.toLocaleString()}`]
        ],
        theme: 'plain',
        styles: { fontSize: 10, cellPadding: 2 }
    });

    // Items Table
    doc.setFontSize(12);
    doc.text("Product Items", 14, (doc as any).lastAutoTable.finalY + 15);

    autoTable(doc, {
        startY: (doc as any).lastAutoTable.finalY + 20,
        head: [["No.", "Product Name", "Category", "Status", "Price"]],
        body: consignment.items.map((item: any, index: number) => [
            index + 1,
            item.productName,
            item.category,
            item.status,
            `฿${item.confirmedPrice?.toLocaleString()}`
        ]),
        theme: 'striped',
        headStyles: { fillColor: [220, 38, 38] }, // Red theme
        styles: { fontSize: 9 }
    });

    doc.save(`batch-${consignment.lot}-${consignment.consignorName}.pdf`);
};
