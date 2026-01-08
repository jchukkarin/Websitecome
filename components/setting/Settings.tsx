'use client'
import React, { useState } from 'react';
import { User, Bell, Lock, Globe, Trash2 } from 'lucide-react'; // ใช้ Lucide icons

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile');

  const menuItems = [
    { id: 'profile', label: 'บัญชีผู้ใช้', icon: <User size={20} /> },
    { id: 'notifications', label: 'การแจ้งเตือน', icon: <Bell size={20} /> },
    { id: 'security', label: 'ความปลอดภัย', icon: <Lock size={20} /> },
    { id: 'language', label: 'ภาษาและภูมิภาค', icon: <Globe size={20} /> },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 p-6">
        <h1 className="text-2xl font-bold mb-8 text-gray-800">Settings</h1>
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === item.id 
                ? 'bg-blue-50 text-blue-600' 
                : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10">
        <div className="max-w-2xl bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-xl font-semibold mb-6">ข้อมูลส่วนตัว</h2>
          
          <div className="space-y-6">
            {/* Input Group */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อแสดงผล</label>
              <input 
                type="text" 
                placeholder="ชื่อของคุณ"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">อีเมล</label>
              <input 
                type="email" 
                placeholder="example@mail.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <hr className="my-8 border-gray-100" />

            {/* Danger Zone */}
            <div className="pt-4">
              <h3 className="text-red-600 font-medium flex items-center mb-2">
                <Trash2 size={18} className="mr-2" /> ลบบัญชี
              </h3>
              <p className="text-sm text-gray-500 mb-4">เมื่อลบแล้วข้อมูลทั้งหมดจะหายไปและไม่สามารถกู้คืนได้</p>
              <button className="bg-red-50 text-red-600 px-4 py-2 rounded-md hover:bg-red-100 transition">
                ลบบัญชีผู้ใช้
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 mt-10">
              <button className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50">ยกเลิก</button>
              <button className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">บันทึกการเปลี่ยนแปลง</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}