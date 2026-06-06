/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import { useState } from 'react';
import { Member, Payment } from '../types';
import { MessageSquare, Phone, Search, AlertCircle, FileSpreadsheet } from 'lucide-react';
import { exportToCSV } from '../utils/export';

interface DefaultersProps {
  members: Member[];
  payments: Payment[];
}

export default function Defaulters({ members, payments }: DefaultersProps) {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter pending members (balance > 0)
  const pendingMembers = members.filter(m =>
    m.status === 'active' &&
    (m.balance || 0) > 0 &&
    (m.name.toLowerCase().includes(searchTerm.toLowerCase()) || m.phone.includes(searchTerm))
  );

  // Helper to find the last payment details for a member
  const getLastPaymentInfo = (memberId: string) => {
    const memberPayments = payments
      .filter(p => p.memberId === memberId)
      .sort((a, b) => b.date.localeCompare(a.date));
    
    if (memberPayments.length === 0) {
      return { date: 'کوئی ادائیگی نہیں', amount: 0 };
    }
    return { 
      date: memberPayments[0].date, 
      amount: memberPayments[0].amount 
    };
  };

  // WhatsApp reminder generator
  const handleWhatsAppSend = (member: Member) => {
    const rawNum = member.whatsapp || member.phone || '';
    // Clean formatted country prefixes or leading zeros
    let formattedNum = rawNum.replace(/\s+/g, '').replace(/[^0-9]/g, '');
    if (formattedNum.startsWith('0')) {
      formattedNum = '92' + formattedNum.substring(1); // Default to Pakistan country code (92)
    }

    const message = `السلام علیکم\n\nمسجد دارالسلام فنڈ کی ماہانہ رقم ابھی واجب الادا ہے۔\nبراہ کرم جلد از جلد جمع کروائیں۔\n\nجزاک اللہ خیراً`;
    const encodedVal = encodeURIComponent(message);
    const url = `https://api.whatsapp.com/send?phone=${formattedNum}&text=${encodedVal}`;

    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Export defaulters list to CSV
  const handleExportDefaulters = () => {
    const headers = ['نام ممبر', 'موبائل نمبر', 'واٹس ایپ نمبر', 'ماہانہ فنڈ رقم', 'مجموعی بقایا', 'آخر ادائیگی تاریخ', 'مکان پتہ'];
    const rows = pendingMembers.map(m => {
      const lastPay = getLastPaymentInfo(m.id);
      return [
        m.name,
        m.phone,
        m.whatsapp || 'درج نہیں',
        `₨ ${m.monthlyFee}`,
        `₨ ${m.balance}`,
        lastPay.date,
        m.address || 'درج نہیں'
      ];
    });

    exportToCSV('بقایا_ممبران_رپورٹ', headers, rows);
  };

  return (
    <div className="space-y-6 animate-fade-in" dir="rtl">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">بقایا ممبران کی فہرست (ڈفالٹرز)</h2>
          <p className="text-xs text-slate-500 mt-1">مسجد کے واجب الادا بقایا جات والے ممبران کی لسٹ اور یاددہانی کے لیے واٹس ایپ پیغام رسانی</p>
        </div>

        {pendingMembers.length > 0 && (
          <button
            onClick={handleExportDefaulters}
            className="bg-emerald-800 hover:bg-emerald-900 text-white px-4 py-2.5 rounded-xl shadow-sm text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <FileSpreadsheet size={15} />
            <span>ایکسل فائل ایکسپورٹ</span>
          </button>
        )}
      </div>

      {/* Warning Box */}
      <div className="bg-amber-50/70 border border-amber-100 p-4 rounded-xl flex items-start gap-3 animate-fade-in text-xs text-amber-800 leading-relaxed">
        <AlertCircle size={18} className="text-amber-700 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold block mb-0.5">اہم معلومات:</span>
          ذیل میں وہ تمام ممبران درج ہیں جن کے ذمے مسجد کا فنڈ کم از کم ایک ماہ کا بقایا ہے۔ آپ سنگل کلک کے ذریعے ہر ممبر کو واٹس ایپ پر ریمائنڈر پیغام بھیج سکتے ہیں۔
        </div>
      </div>

      {/* Search Filter */}
      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
        <div className="relative">
          <input
            type="text"
            placeholder="بقایا دار ممبران میں تلاش کریں..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-10 pl-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-red-500 transition-colors"
          />
          <Search className="absolute right-3 top-2.5 text-slate-400" size={18} />
        </div>
      </div>

      {/* Grid of Pending list */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        {pendingMembers.length === 0 ? (
          <div className="text-center py-16 text-slate-400 space-y-3">
            <span className="text-4xl">🎉</span>
            <p className="text-sm">کوئی بقایا رکن موجود نہیں ہے۔ تمام ممبران باقاعدہ ادائیگی کر رہے ہیں!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">رکن کا نام</th>
                  <th className="py-3 px-4">موبائل فون نمبر</th>
                  <th className="py-3 px-4 text-center">ماہانہ فنڈ مقررہ</th>
                  <th className="py-3 px-4 text-center">کل واجب بقایا</th>
                  <th className="py-3 px-4 text-center">آخری ادائیگی تاریخ</th>
                  <th className="py-3 px-4 text-left">اطلاع (ریمائنڈر)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pendingMembers.map((member) => {
                  const lastPay = getLastPaymentInfo(member.id);
                  return (
                    <tr key={member.id} className="hover:bg-slate-50/40 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-slate-800">
                        {member.name}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-xs text-slate-600">
                        <span className="flex items-center gap-1">
                          <Phone size={11} className="text-slate-400" />
                          {member.whatsapp || member.phone}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center font-bold text-slate-700">₨ {member.monthlyFee.toLocaleString()}</td>
                      <td className="py-3.5 px-4 text-center font-extrabold text-red-600 font-sans">
                        ₨ {(member.balance || 0).toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 text-center text-xs">
                        <div className="font-semibold text-slate-600">{lastPay.date}</div>
                        {lastPay.amount > 0 && <div className="text-[10px] text-slate-400 mt-0.5">(رقم: ₨ {lastPay.amount})</div>}
                      </td>
                      <td className="py-3.5 px-4 text-left">
                        <button
                          onClick={() => handleWhatsAppSend(member)}
                          className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 hover:text-emerald-800 px-3.5 py-1.5 rounded-lg text-xs font-bold border border-emerald-100 transition-colors inline-flex items-center gap-1.5"
                        >
                          <MessageSquare size={13} />
                          <span>واٹس ایپ بھیجیں</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
