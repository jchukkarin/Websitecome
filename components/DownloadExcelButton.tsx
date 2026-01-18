"use client";

export default function DownloadExcelButton() {
    const downloadExcel = async () => {
        try {
            const res = await fetch("/api/export/excel");
            if (!res.ok) throw new Error("Export failed");
            const blob = await res.blob();

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "products.xlsx";
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Download failed:", error);
            alert("Failed to download Excel file");
        }
    };

    return (
        <button
            onClick={downloadExcel}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition-colors flex items-center gap-2"
        >
            <span>📥</span>
            <span>ดาวน์โหลด Excel</span>
        </button>
    );
}
