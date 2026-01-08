'use client'
import React from 'react';
import { Plus, TrendingUp, DollarSign, Calendar, ArrowUpRight, Filter } from 'lucide-react';

export default function InCome() {
  // สมมติข้อมูลประวัติรายได้
  const transactions = [
    { id: 1, source: 'Project A - Landing Page', category: 'Freelance', amount: 15000, date: '2023-10-01' },
    { id: 2, source: 'Monthly Salary', category: 'Full-time', amount: 45000, date: '2023-10-05' },
    { id: 3, source: 'Stock Dividend', category: 'Investment', amount: 1200, date: '2023-10-10' },
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Income Overview</h1>
          <p className="text-gray-500">ติดตามและจัดการรายได้ทั้งหมดของคุณ</p>
        </div>
        <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center transition">
          <Plus size={18} className="mr-2" /> เพิ่มรายได้
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-100 text-green-600 rounded-lg"><DollarSign size={24} /></div>
            <span className="text-green-500 text-sm font-medium flex items-center">
              <TrendingUp size={16} className="mr-1" /> +12%
            </span>
          </div>
          <p className="text-gray-500 text-sm">รายได้รวมเดือนนี้</p>
          <h3 className="text-2xl font-bold text-gray-800">฿61,200.00</h3>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Calendar size={24} /></div>
          </div>
          <p className="text-gray-500 text-sm">คาดการณ์รายได้เดือนหน้า</p>
          <h3 className="text-2xl font-bold text-gray-800">฿55,000.00</h3>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-purple-100 text-purple-600 rounded-lg"><ArrowUpRight size={24} /></div>
          </div>
          <p className="text-gray-500 text-sm">ค่าเฉลี่ยต่อสัปดาห์</p>
          <h3 className="text-2xl font-bold text-gray-800">฿15,300.00</h3>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="font-semibold text-gray-800">ประวัติรายได้ล่าสุด</h2>
          <button className="text-gray-500 hover:text-gray-700 flex items-center text-sm border px-3 py-1 rounded-md">
            <Filter size={14} className="mr-2" /> ตัวกรอง
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-600 text-sm uppercase">
              <tr>
                <th className="px-6 py-4 font-medium">แหล่งที่มา</th>
                <th className="px-6 py-4 font-medium">หมวดหมู่</th>
                <th className="px-6 py-4 font-medium">วันที่</th>
                <th className="px-6 py-4 font-medium text-right">จำนวนเงิน</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {transactions.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-medium text-gray-800">{item.source}</td>
                  <td className="px-6 py-4">
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-sm">{item.date}</td>
                  <td className="px-6 py-4 text-right text-green-600 font-bold">
                    +฿{item.amount.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}