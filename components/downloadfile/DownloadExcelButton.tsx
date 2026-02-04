"use client";

import { useState } from "react";
import { Button } from "@heroui/react";
import { Download } from "lucide-react";
import toast from "react-hot-toast";

export default function DownloadExcelButton() {
  const [loading, setLoading] = useState(false);

  const download = async () => {
    try {
      setLoading(true);

      // 🔥 Use GET method (API changed to GET)
      const res = await fetch("/api/export/dashboard");

      if (res.status === 401) {
        toast.error("กรุณาเข้าสู่ระบบก่อน");
        return;
      }

      if (!res.ok) {
        // Check if response is JSON before parsing
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Export failed");
        } else {
          throw new Error(`Export failed with status: ${res.status}`);
        }
      }

      const blob = await res.blob();
      // ✅ ระบุ MIME type ให้ชัดเจนเมื่อสร้าง URL
      const excelBlob = new Blob([blob], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = URL.createObjectURL(excelBlob);

      // Get filename from Content-Disposition header
      const contentDisposition = res.headers.get("Content-Disposition");
      let filename = `dashboard_${new Date().toISOString().split('T')[0]}.xlsx`;

      if (contentDisposition) {
        // ✅ ปรับ Regex ให้ดึงเฉพาะชื่อไฟล์ข้างในเครื่องหมายคำพูด
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1];
        }
      }

      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a); // ✅ เพิ่มเข้า DOM ก่อนคลิก (บาง Browser ต้องการ)
      a.click();
      document.body.removeChild(a);

      URL.revokeObjectURL(url);
      toast.success("ดาวน์โหลด Excel สำเร็จ", {
        icon: '📊',
        style: {
          borderRadius: '10px',
          background: '#10b981',
          color: '#fff',
          fontWeight: 'bold'
        },
      });
    } catch (e) {
      console.error(e);
      toast.error("ไม่สามารถ Export ได้", {
        style: {
          borderRadius: '10px',
          background: '#ef4444',
          color: '#fff',
          fontWeight: 'bold'
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={download}
      isLoading={loading}
      color="success"
      variant="shadow"
      startContent={!loading && <Download size={18} />}
      className="font-bold bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl"
    >
      {loading ? "กำลังดาวน์โหลด..." : "ดาวน์โหลด Excel"}
    </Button>
  );
}
