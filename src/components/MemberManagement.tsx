/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Member, Payment } from '../types';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  UserPlus, 
  FileText, 
  CheckCircle2, 
  X, 
  Phone, 
  MapPin, 
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Info,
  Users
} from 'lucide-react';

interface MemberManagementProps {
  members: Member[];
  payments: Payment[];
  onAddMember: (memberData: Omit<Member, 'id' | 'balance' | 'totalPaid' | 'totalDue' | 'billedMonths'>) => void;
  onEditMember: (member: Member) => void;
  onDeleteMember: (id: string) => void;
  currentDateStr: string;
}

export default function MemberManagement({
  members,
  payments,
  onAddMember,
  onEditMember,
  onDeleteMember,
  currentDateStr
}: MemberManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedLedgerMember, setSelectedLedgerMember] = useState<Member | null>(null);
  
  // Editing state
  const [editingMember, setEditingMember] = useState<Member | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [address, setAddress] = useState('');
  const [monthlyFee, setMonthlyFee] = useState<number>(300);
  const [joiningDate, setJoiningDate] = useState(currentDateStr);
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');

  const resetForm = () => {
    setName('');
    setPhone('');
    setWhatsapp('');
    setAddress('');
    setMonthlyFee(300);
    setJoiningDate(currentDateStr);
    setNotes('');
    setStatus('active');
    setEditingMember(null);
    setIsFormOpen(false);
  };

  const handleEditClick = (member: Member) => {
    setEditingMember(member);
    setName(member.name);
    setPhone(member.phone);
    setWhatsapp(member.whatsapp);
    setAddress(member.address);
    setMonthlyFee(member.monthlyFee);
    setJoiningDate(member.joiningDate);
    setNotes(member.notes);
    setStatus(member.status);
    setIsFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingMember) {
      onEditMember({
        ...editingMember,
        name,
        phone,
        whatsapp,
        address,
        monthlyFee: Number(monthlyFee),
        joiningDate,
        notes,
        status,
        // Keep these fields but we can recalculate or update them
        balance: editingMember.balance + (Number(monthlyFee) - editingMember.monthlyFee) * (editingMember.billedMonths?.length || 0),
        totalDue: editingMember.totalDue + (Number(monthlyFee) - editingMember.monthlyFee) * (editingMember.billedMonths?.length || 0)
      });
    } else {
      onAddMember({
        name,
        phone,
        whatsapp,
        address,
        monthlyFee: Number(monthlyFee),
        joiningDate,
        notes,
        status
      });
    }
    resetForm();
  };

  const filteredMembers = members.filter(m =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.phone.includes(searchTerm) ||
    m.whatsapp.includes(searchTerm) ||
    m.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in" dir="rtl">
      
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">ممبر مینجمنٹ (رجسٹریشن ریکارڈ)</h2>
          <p className="text-xs text-slate-500 mt-1">نیا ممبر رجسٹر کریں، ان کی معلومات میں ترمیم کریں، یا ان کے اکاؤنٹ کا کھاتہ دیکھیں</p>
        </div>
        
        <button
          onClick={() => {
            resetForm();
            setIsFormOpen(true);
          }}
          className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2.5 rounded-xl shadow-sm text-sm font-semibold flex items-center gap-2 self-start sm:self-auto transition-colors"
        >
          <UserPlus size={18} />
          <span>نیا ممبر شامل کریں</span>
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="ممبر کا نام، پتہ یا موبائل نمبر تلاش کریں..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-10 pl-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-emerald-500 transition-colors placeholder:text-slate-400"
          />
          <Search className="absolute right-3 top-2.5 text-slate-400" size={18} />
        </div>
      </div>

      {/* Main Members Grid/Table */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        {filteredMembers.length === 0 ? (
          <div className="text-center py-16 text-slate-400 space-y-3">
            <Users size={48} className="mx-auto text-slate-300 stroke-1" />
            <p className="text-sm">کوئی ممبر نہیں ملا۔</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead className="bg-slate-50/75 text-slate-500 font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">نام</th>
                  <th className="py-3 px-4">رابطہ نمبر</th>
                  <th className="py-3 px-4">پتہ</th>
                  <th className="py-3 px-4 text-center">ماہانہ فنڈ</th>
                  <th className="py-3 px-4 text-center">موجودہ بقایا</th>
                  <th className="py-3 px-4 text-center">حیثیت</th>
                  <th className="py-3 px-4 text-left">اقدامات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-slate-50/40 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      <div>{member.name}</div>
                      <div className="text-[10px] text-slate-400 font-normal">شامل ہوا: {member.joiningDate}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs text-slate-600">
                      <div className="flex flex-col gap-0.5">
                        <span className="flex items-center gap-1"><Phone size={10} className="text-slate-400" /> {member.phone}</span>
                        {member.whatsapp && <span className="flex items-center gap-1 text-emerald-600 font-medium"><MessageSquare size={10} /> {member.whatsapp}</span>}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 max-w-[180px] truncate" title={member.address}>
                      <span className="flex items-center gap-1"><MapPin size={11} className="text-slate-400 inline shrink-0" /> {member.address || 'درج نہیں ہے'}</span>
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold text-slate-700">₨ {member.monthlyFee.toLocaleString()}</td>
                    <td className={`py-3.5 px-4 text-center font-bold font-sans ${member.balance > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                      ₨ {(member.balance || 0).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                        member.status === 'active' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}>
                        {member.status === 'active' ? 'فعال' : 'غیر فعال'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-left">
                      <div className="inline-flex items-center gap-1">
                        
                        {/* View Ledger */}
                        <button
                          onClick={() => setSelectedLedgerMember(member)}
                          className="bg-sky-50 hover:bg-sky-100 text-sky-700 p-1.5 rounded-lg transition-colors border border-sky-100"
                          title="انفرادی کھاتہ"
                        >
                          <FileText size={15} />
                        </button>

                        {/* Edit Member */}
                        <button
                          onClick={() => handleEditClick(member)}
                          className="bg-amber-50 hover:bg-amber-100 text-amber-700 p-1.5 rounded-lg transition-colors border border-amber-100"
                          title="ترمیم کریں"
                        >
                          <Edit size={15} />
                        </button>

                        {/* Delete Member */}
                        <button
                          onClick={() => {
                            if (confirm(`کیا آپ واقعی ممبر \"${member.name}\" کو خارج کرنا چاہتے ہیں؟ فنڈ اور ادائیگیوں کا سابقہ ریکارڈ برقرار رہے گا۔`)) {
                              onDeleteMember(member.id);
                            }
                          }}
                          className="bg-rose-50 hover:bg-rose-100 text-rose-700 p-1.5 rounded-lg transition-colors border border-rose-100"
                          title="حذف کریں"
                        >
                          <Trash2 size={15} />
                        </button>

                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Member Dialog (Modal) */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-2xl border border-slate-100 shadow-xl overflow-hidden animate-scale-up text-right" dir="rtl">
            
            {/* Header */}
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800">
                {editingMember ? 'ترمیم ممبر اکاؤنٹ' : 'شامل کریں نیا مسجد ممبر فنڈ'}
              </h3>
              <button 
                onClick={resetForm}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              
              {/* Name field */}
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">ممبر کا مکمل نام *</label>
                <input
                  type="text"
                  required
                  placeholder="محمد احمد خان"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Grid For Contact numbers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">موبائل فون نمبر *</label>
                  <input
                    type="tel"
                    required
                    placeholder="03001234567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-slate-800 text-sm font-mono focus:outline-none focus:border-emerald-500 text-left"
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">واٹس ایپ فون نمبر (اختیاری)</label>
                  <input
                    type="tel"
                    placeholder="03001234567"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-slate-800 text-sm font-mono focus:outline-none focus:border-emerald-500 text-left"
                    dir="ltr"
                  />
                </div>
              </div>

              {/* Address Field */}
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">مکمل پتہ اور گلی نمبر</label>
                <input
                  type="text"
                  placeholder="مکان اور گلی نمبر، محلہ دارالسلام، کراچی"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Grid For Fee & Joining dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">ماہانہ مسجد فنڈ رقم (روپے) *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={monthlyFee}
                    onChange={(e) => setMonthlyFee(Number(e.target.value))}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">فنڈ شمولیت کی تاریخ *</label>
                  <input
                    type="date"
                    required
                    value={joiningDate}
                    onChange={(e) => setJoiningDate(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:border-emerald-500 text-left"
                  />
                </div>
              </div>

              {/* Status Select (Only for Edit) */}
              {editingMember && (
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">ممبر رکنیت اسٹیٹس</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as 'active' | 'inactive')}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:border-emerald-500"
                  >
                    <option value="active">فعال (باقاعدہ بلنگ جاری رکھیں)</option>
                    <option value="inactive">غیر فعال (بلنگ نہ کریں)</option>
                  </select>
                </div>
              )}

              {/* Notes Field */}
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">اضافی نوٹس اور معلومات</label>
                <textarea
                  rows={2}
                  placeholder="کوئی اور اضافی بات یا حوالہ..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={resetForm}
                  className="border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-xl text-sm"
                >
                  منسوخ کریں
                </button>
                <button
                  type="submit"
                  className="bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-2 rounded-xl text-sm font-semibold"
                >
                  {editingMember ? 'تبدیلیاں محفوظ کریں' : 'ممبر شامل کریں'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Individual Ledger Modal (انفرادی کھاتہ) */}
      {selectedLedgerMember && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-2xl w-full rounded-2xl border border-slate-100 shadow-xl overflow-hidden animate-scale-up text-right" dir="rtl">
            
            {/* Header */}
            <div className="bg-emerald-850 text-white px-6 py-5 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">انفرادی کھاتہ اور مالی ہسٹری</h3>
                <p className="text-xs text-emerald-100 mt-1">ممبر: {selectedLedgerMember.name}</p>
              </div>
              <button 
                onClick={() => setSelectedLedgerMember(null)}
                className="text-emerald-200 hover:text-white transition-colors p-1"
              >
                <X size={22} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              
              {/* Member stats breakdown */}
              <div className="grid grid-cols-3 gap-2 text-center bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">مجموعی واجب الاجل</span>
                  <span className="text-base font-bold text-slate-700 block mt-1">
                    ₨ {(selectedLedgerMember.totalDue || 0).toLocaleString()}
                  </span>
                </div>
                <div className="border-x border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">وصول شدہ رقم</span>
                  <span className="text-base font-bold text-emerald-600 block mt-1">
                    ₨ {(selectedLedgerMember.totalPaid || 0).toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block uppercase font-sans">موجودہ بقایا</span>
                  <span className={`text-base font-bold block mt-1 ${selectedLedgerMember.balance > 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
                    ₨ {(selectedLedgerMember.balance || 0).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Contact and address details */}
                <div className="space-y-3 bg-white p-4 rounded-xl border border-slate-100">
                  <h4 className="text-xs font-bold text-slate-700 border-b border-slate-100 pb-2">رابطہ اور رجسٹریشن کی تفصیلات</h4>
                  <div className="space-y-2 text-xs text-slate-600">
                    <div className="flex justify-between">
                      <span className="text-slate-400">فون نمبر:</span>
                      <span className="font-mono">{selectedLedgerMember.phone || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">واٹس ایپ نمبر:</span>
                      <span className="font-mono text-emerald-700 font-semibold">{selectedLedgerMember.whatsapp || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">پتہ رہائش:</span>
                      <span className="text-slate-800">{selectedLedgerMember.address || 'درج نہیں'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-sans">شمولیت کی تاریخ:</span>
                      <span className="font-mono">{selectedLedgerMember.joiningDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">ماہانہ فنڈ مقررہ:</span>
                      <span className="font-semibold text-slate-800">₨ {selectedLedgerMember.monthlyFee.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">حیثیت رکن:</span>
                      <span className={`font-semibold ${selectedLedgerMember.status === 'active' ? 'text-emerald-700' : 'text-slate-500'}`}>
                        {selectedLedgerMember.status === 'active' ? 'فعال' : 'غیر فعال'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Monthly Bills History List */}
                <div className="space-y-3 bg-white p-4 rounded-xl border border-slate-100">
                  <h4 className="text-xs font-bold text-slate-700 border-b border-slate-100 pb-2">بلنگ خلاصہ بلحاظ مہینہ</h4>
                  <div className="max-h-[140px] overflow-y-auto space-y-1.5 custom-scrollbar pr-1" dir="rtl">
                    {(!selectedLedgerMember.billedMonths || selectedLedgerMember.billedMonths.length === 0) ? (
                      <p className="text-xs text-slate-400 text-center py-4">ابھی کوئی مہینہ بل نہیں ہوا۔</p>
                    ) : (
                      selectedLedgerMember.billedMonths.map((monthStr, sIdx) => (
                        <div key={sIdx} className="flex justify-between items-center text-xs bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100/50">
                          <span className="font-semibold text-slate-700 font-sans">قسط: {monthStr}</span>
                          <span className="text-slate-500 font-bold">₨ {selectedLedgerMember.monthlyFee.toLocaleString()}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>

              {/* Payments Ledger List */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-700 border-b border-slate-100 pb-2">فنڈ ادائیگیوں کی مکمل تاریخ</h4>
                <div className="max-h-[180px] overflow-y-auto border border-slate-50 rounded-lg">
                  {payments.filter(p => p.memberId === selectedLedgerMember.id).length === 0 ? (
                    <div className="text-center py-8 text-slate-400 text-xs">
                      اس ممبر کی طرف سے اب تک کوئی فنڈ وصول نہیں ہوا۔
                    </div>
                  ) : (
                    <table className="w-full text-right text-xs">
                      <thead className="bg-slate-50 text-slate-500 font-semibold sticky top-0">
                        <tr>
                          <th className="py-2 px-3">رقم</th>
                          <th className="py-2 px-3">تاریخ ادائیگی</th>
                          <th className="py-2 px-3 text-left">تفصیل / نوٹس</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {payments
                          .filter(p => p.memberId === selectedLedgerMember.id)
                          .map((payment) => (
                            <tr key={payment.id} className="hover:bg-slate-50/50">
                              <td className="py-2.5 px-3 font-bold text-slate-800">₨ {payment.amount.toLocaleString()}</td>
                              <td className="py-2.5 px-3 text-slate-500">{payment.date}</td>
                              <td className="py-2.5 px-3 text-slate-400 text-left max-w-[150px] truncate" title={payment.notes}>
                                {payment.notes || '-'}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="bg-slate-50 px-6 py-4 flex justify-end gap-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedLedgerMember(null)}
                className="bg-slate-800 hover:bg-slate-900 text-white px-5 py-2 rounded-xl text-xs font-semibold"
              >
                بند کریں
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
