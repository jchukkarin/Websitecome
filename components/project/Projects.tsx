'use client'
import React, { useState } from 'react';
import { Save, X, ArrowDownCircle, ArrowUpCircle, Tag, AlignLeft, Calendar as CalendarIcon } from 'lucide-react';

export default function Projects() {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    type: 'expense', // 'income' หรือ 'expense'
    category: 'General',
    date: new Date().toISOString().split('T')[0],
    note: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('บันทึกข้อมูล:', formData);
    alert('บันทึกรายการสำเร็จ!');
    // ตรงนี้คุณสามารถเพิ่ม Logic เพื่อส่งข้อมูลไปยัง API หรือ State Context ได้
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">บันทึกรายการใหม่</h1>
            <p className="text-gray-500">เพิ่มรายการรายรับหรือรายจ่ายของคุณ</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* ส่วนเลือกประเภท (Income / Expense) */}
          <div className="flex border-b border-gray-100">
            <button
              type="button"
              onClick={() => setFormData({...formData, type: 'income'})}
              className={`flex-1 py-4 flex items-center justify-center font-medium transition ${
                formData.type === 'income' ? 'bg-green-50 text-green-600 border-b-2 border-green-600' : 'text-gray-400 hover:bg-gray-50'
              }`}
            >
              <ArrowUpCircle size={20} className="mr-2" /> รายรับ
            </button>
            <button
              type="button"
              onClick={() => setFormData({...formData, type: 'expense'})}
              className={`flex-1 py-4 flex items-center justify-center font-medium transition ${
                formData.type === 'expense' ? 'bg-red-50 text-red-600 border-b-2 border-red-600' : 'text-gray-400 hover:bg-gray-50'
              }`}
            >
              <ArrowDownCircle size={20} className="mr-2" /> รายจ่าย
            </button>
          </div>

          <div className="p-8 space-y-6">
            {/* ชื่อรายการ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">ชื่อรายการ / โปรเจกต์</label>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  required
                  type="text"
                  placeholder="เช่น ค่าจ้างทำเว็บ, ค่าโฮสติ้ง"
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* จำนวนเงิน */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">จำนวนเงิน (บาท)</label>
                <input
                  required
                  type="number"
                  placeholder="0.00"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                />
              </div>

              {/* วันที่ */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">วันที่</label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="date"
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                  />
                </div>
              </div>
            </div>

            {/* หมวดหมู่ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">หมวดหมู่</label>
              <select 
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none appearance-none bg-white"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                <option value="Freelance">Freelance / งานนอก</option>
                <option value="Salary">เงินเดือน</option>
                <option value="Food">อาหารและเครื่องดื่ม</option>
                <option value="Transport">การเดินทาง</option>
                <option value="Other">อื่นๆ</option>
              </select>
            </div>

            {/* หมายเหตุ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">หมายเหตุ (เพิ่มเติม)</label>
              <div className="relative">
                <AlignLeft className="absolute left-3 top-3 text-gray-400" size={18} />
                <textarea
                  rows={3}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="รายละเอียดเพิ่มเติม..."
                  value={formData.note}
                  onChange={(e) => setFormData({...formData, note: e.target.value})}
                ></textarea>
              </div>
            </div>

            {/* ปุ่มกด */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                className="flex-1 px-6 py-3 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition flex items-center justify-center"
              >
                <X size={18} className="mr-2" /> ยกเลิก
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition flex items-center justify-center"
              >
                <Save size={18} className="mr-2" /> บันทึกรายการ
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}