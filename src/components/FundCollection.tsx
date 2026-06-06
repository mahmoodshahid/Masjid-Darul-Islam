/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { Member, Payment } from '../types';
import { 
  Check, 
  Search, 
  Printer, 
  DollarSign, 
  Calendar, 
  FileText, 
  X,
  CreditCard,
  UserCheck
} from 'lucide-react';

interface FundCollectionProps {
  members: Member[];
  payments: Payment[];
  onAddPayment: (paymentData: Omit<Payment, 'id'>) => Payment; // Returns the added payment to print easily
  currentDateStr: string;
}

export default function FundCollection({
  members,
  payments,
  onAddPayment,
  currentDateStr
}: FundCollectionProps) {
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [amount, setAmount] = useState<number | ''>('');
  const [date, setDate] = useState(currentDateStr);
  const [notes, setNotes] = useState('');
  const [searchMemberTerm, setSearchMemberTerm] = useState('');
  
  // Printable receipt state
  const [activeReceipt, setActiveReceipt] = useState<{
    receiptNo: string;
    memberName: string;
    memberPhone: string;
    amount: number;
    date: string;
    notes: string;
  } | null>(null);

  const selectedMember = members.find(m => m.id === selectedMemberId);

  // Filter members for selection
  const activeMembersForSelect = members.filter(m => 
    m.status === 'active' &&
    (m.name.toLowerCase().includes(searchMemberTerm.toLowerCase()) || 
     m.phone.includes(searchMemberTerm))
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMemberId || !amount || Number(amount) <= 0) {
      alert('براء کرم ممبر اور درست فنڈ رقم منتخب کریں!');
      return;
    }

    const newPayment = onAddPayment({
      memberId: selectedMemberId,
      memberName: selectedMember?.name || '',
      amount: Number(amount),
      date,
      notes
    });

    // Create printable receipt preview immediately
    setActiveReceipt({
      receiptNo: newPayment.id.substring(0, 8).toUpperCase(),
      memberName: selectedMember?.name || '',
      memberPhone: selectedMember?.phone || '',
      amount: Number(amount),
      date,
      notes
    });

    // Reset Form Fields
    setAmount('');
    setNotes('');
    setSearchMemberTerm('');
    setSelectedMemberId('');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-fade-in" dir="rtl">
      
      {/* Printable Receipt Styles (injected strictly to handle web browser print options seamlessly) */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .printable-area, .printable-area * {
            visibility: visible;
          }
          .printable-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white !important;
            color: black !important;
            padding: 2rem !important;
            direction: rtl;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-slate-800">فنڈ وصولی (نئی ادائیگی درج کریں)</h2>
        <p className="text-xs text-slate-500 mt-1">مسجد دارالسلام کے کسی بھی رجسٹرڈ ممبر کا ماہانہ فنڈ وصول کریں اور موقع پر کمپیوٹر ریسیڈ پرنٹ کریں</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Form Container */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-100 shadow-sm space-y-5">
          <h3 className="text-md font-bold text-slate-800 pb-2.5 border-b border-slate-100 flex items-center gap-2 text-emerald-800">
            <CreditCard size={18} />
            <span>نئی ادائیگی فارم</span>
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Find Member Section */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-600">ممبر تلاش اور منتخب کریں *</label>
              
              <div className="relative">
                <input
                  type="text"
                  placeholder="ممبر کا نام یا فون نمبر لکھیں..."
                  value={searchMemberTerm}
                  onChange={(e) => setSearchMemberTerm(e.target.value)}
                  className="w-full pr-10 pl-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-emerald-500"
                />
                <Search className="absolute right-3 top-2.5 text-slate-400" size={16} />
              </div>

              {/* Members Selection Dropdown list */}
              <div className="max-h-[160px] overflow-y-auto border border-slate-100 rounded-lg divide-y divide-slate-50 mt-1 bg-white">
                {activeMembersForSelect.length === 0 ? (
                  <p className="p-3 text-xs text-slate-400 text-center">کوئی ممبر نہیں ملا۔</p>
                ) : (
                  activeMembersForSelect.map(m => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => {
                        setSelectedMemberId(m.id);
                        setSearchMemberTerm(m.name);
                      }}
                      className={`w-full text-right px-4 py-2.5 text-xs hover:bg-slate-50 flex items-center justify-between transition-colors ${
                        selectedMemberId === m.id ? 'bg-emerald-50/70 hover:bg-emerald-50 text-emerald-800 font-bold' : 'text-slate-700'
                      }`}
                    >
                      <div className="flex flex-col text-right">
                        <span>{m.name}</span>
                        <span className="text-[10px] text-slate-400 font-normal font-mono">{m.phone}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-slate-500 font-semibold font-sans">ماہانہ: ₨ {m.monthlyFee.toLocaleString()}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] ${
                          m.balance > 0 ? 'bg-rose-50 text-rose-600 font-bold' : 'bg-emerald-50 text-emerald-700'
                        }`}>
                          بقایا: ₨ {m.balance.toLocaleString()}
                        </span>
                        {selectedMemberId === m.id && <Check size={14} className="text-emerald-700" />}
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Selected Member Quick View Card */}
            {selectedMember && (
              <div className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-xl flex items-center justify-between animate-fade-in text-xs">
                <div className="space-y-1">
                  <div className="font-bold text-slate-800">{selectedMember.name}</div>
                  <div className="text-slate-500">پتہ: {selectedMember.address || 'درج نہیں'}</div>
                </div>
                <div className="text-left space-y-1">
                  <div>ماہانہ فنڈ مقررہ: <strong className="text-slate-800">₨ {selectedMember.monthlyFee.toLocaleString()}</strong></div>
                  <div>مجموعی واجب بقایا: <strong className="text-rose-600 font-bold text-sm">₨ {selectedMember.balance.toLocaleString()}</strong></div>
                </div>
              </div>
            )}

            {/* Amount and payments date details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">وصول ہونے والی فنڈ رقم (روپے) *</label>
                <input
                  type="number"
                  required
                  min={1}
                  placeholder="مثال: 500"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">حصول فنڈ کی تاریخ *</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:border-emerald-500 text-left"
                />
              </div>
            </div>

            {/* Receipt notes */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">اضافی تفصیل / نوٹس</label>
              <input
                type="text"
                placeholder="مثال: مئی اور جون کے بقایا جات مسجد فنڈ"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Submit payment buttons */}
            <button
              type="submit"
              disabled={!selectedMemberId || !amount}
              className={`w-full py-3 rounded-xl text-white font-bold shadow-sm transition-all focus:outline-none ${
                selectedMemberId && amount 
                  ? 'bg-emerald-700 hover:bg-emerald-800 cursor-pointer' 
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              فنڈ وصولی درج کریں اور رسید بنائیں
            </button>

          </form>
        </div>

        {/* Dynamic Sidebar Payment details */}
        <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
            <UserCheck size={16} />
            <span>فوری فنڈ گائیڈ</span>
          </h3>
          <ul className="text-xs text-slate-500 space-y-2.5 list-disc list-inside">
            <li>جب آپ کسی ممبر سے فنڈ وصول کر کے درج کریں گے تو بقایا رقم اسی وقت خودبخود کم کر دی جائے گی۔</li>
            <li>اگر ممبر پچھلی تمام بقایا رقم یکمشت ادا کرے تو ان کا بقایا صفر (0) ہو جائے گا۔</li>
            <li>وصول کرتے ہی اوپر کی طرف پرنٹ ایبل رسید نمودار ہو جائے گی جسے فوری طور پر پرنٹر سے نکالا جا سکتا ہے۔</li>
          </ul>
        </div>

      </div>

      {/* Modern Printable Receipt Section popup and display */}
      {activeReceipt && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto no-print">
          <div className="bg-white max-w-md w-full rounded-2xl border border-slate-200 shadow-2xl p-6 relative animate-scale-up text-right space-y-6">
            
            {/* Close button */}
            <button 
              onClick={() => setActiveReceipt(null)}
              className="absolute top-4 left-4 text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-full hover:bg-slate-50"
            >
              <X size={18} />
            </button>

            {/* Printable Area Wrapper */}
            <div className="printable-area border-2 border-emerald-800 rounded-xl p-5 bg-emerald-50/20 shadow-inner space-y-4 relative overflow-hidden">
              
              {/* Decorative islamic pattern overlay */}
              <div className="absolute top-0 right-0 w-20 h-20 border-r-4 border-t-4 border-emerald-800/15"></div>
              <div className="absolute bottom-0 left-0 w-20 h-20 border-l-4 border-b-4 border-emerald-800/15"></div>
              
              {/* Receipt Header Text */}
              <div className="text-center space-y-1">
                <span className="text-xs font-bold text-emerald-800 block uppercase tracking-wider">الْمَسْجِد دَارُ السَّلَام</span>
                <h4 className="text-xl font-extrabold text-slate-800 tracking-tight">مسجد دارالسلام فنڈ رسید</h4>
                <p className="text-[10px] text-slate-500 font-mono">رسید نمبر: {activeReceipt.receiptNo}</p>
              </div>

              {/* Data Rows */}
              <div className="border-t border-b border-dashed border-emerald-800/30 py-4 my-2 text-xs space-y-2.5 text-slate-700 font-sans">
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-400">نام ممبر:</span>
                  <span className="font-bold text-slate-900">{activeReceipt.memberName}</span>
                </div>
                {activeReceipt.memberPhone && (
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-400">رابطہ نمبر:</span>
                    <span className="font-semibold font-mono">{activeReceipt.memberPhone}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-400">تاریخ ادائیگی:</span>
                  <span className="font-semibold">{activeReceipt.date}</span>
                </div>
                <div className="flex justify-between py-1 bg-emerald-600/10 px-2 rounded-lg font-bold">
                  <span className="text-emerald-900">وصول شدہ رقم:</span>
                  <span className="text-emerald-800 font-bold text-sm">₨ {activeReceipt.amount.toLocaleString()} /-</span>
                </div>
                {activeReceipt.notes && (
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-400">تفصیل:</span>
                    <span className="text-slate-600 italic font-medium">{activeReceipt.notes}</span>
                  </div>
                )}
              </div>

              {/* Bottom Signature & stamps */}
              <div className="pt-8 flex justify-between items-center text-[11px] text-slate-500">
                <div className="text-center w-28 border-t border-slate-300 pt-1">
                  دستخط وصول کنندہ
                </div>
                <div className="text-center w-28 border-t border-slate-300 pt-1">
                  مہر مسجد کمیٹی
                </div>
              </div>

              {/* Islamic Quote/Footer msg */}
              <p className="text-[10px] text-center text-emerald-800/80 font-semibold pt-3 border-t border-emerald-700/10">
                اللہ تعالی آپ کے مال اور وقت میں برکت عطا فرمائے۔ جزاک اللہ خیراً
              </p>

            </div>

            {/* Print and Actions footer triggers */}
            <div className="flex gap-3 justify-end pt-2">
              <button
                onClick={() => setActiveReceipt(null)}
                className="border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-xl text-xs font-semibold"
              >
                بند کریں
              </button>
              <button
                onClick={handlePrint}
                className="bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
              >
                <Printer size={15} />
                <span>رسید پرنٹ کریں</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
