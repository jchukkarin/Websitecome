"use client";

import { useState } from "react";
import toast from "react-hot-toast";

export default function DownloadProductExcel() {
  const [loading, setLoading] = useState(false);

  const download = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/export/products");

      if (res.status === 401) {
        toast.error("กรุณาเข้าสู่ระบบก่อน");
        return;
      }

      if (!res.ok) {
        throw new Error("Export failed");
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "products.xlsx";
      a.click();

      URL.revokeObjectURL(url);
      toast.success("ดาวน์โหลด Excel สำเร็จ");
    } catch (e) {
      console.error(e);
      toast.error("ไม่สามารถ Export ได้");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={download}
      disabled={loading}
      className={`px-4 py-2 rounded flex items-center gap-2
        ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-green-600 hover:bg-green-700 text-white"
        }`}
    >
      {loading ? "⏳ " : "⬇ "}
    </button>
  );
}
