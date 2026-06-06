/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Member, Payment, Expense, ExpenseCategory } from '../types';
import { Printer, FileSpreadsheet, Calendar, Search, Filter, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import { exportToCSV } from '../utils/export';

interface ReportsProps {
  members: Member[];
  payments: Payment[];
  expenses: Expense[];
  currentDateStr: string;
}

type ReportType = 'daily' | 'monthly' | 'yearly' | 'defaulters' | 'expenses' | 'income_expense';

export default function Reports({
  members,
  payments,
  expenses,
  currentDateStr
}: ReportsProps) {
  const [reportType, setReportType] = useState<ReportType>('monthly');
  
  // Date states for filters
  const [selectedDate, setSelectedDate] = useState(currentDateStr);
  const [selectedMonth, setSelectedMonth] = useState(currentDateStr.substring(0, 7)); // YYYY-MM
  const [selectedYear, setSelectedYear] = useState(currentDateStr.substring(0, 4)); // YYYY

  // Get filtered data based on selection
  const getFilterDescription = () => {
    switch (reportType) {
      case 'daily': return `تاریخ: ${selectedDate}`;
      case 'monthly': return `برائے مہینہ: ${selectedMonth}`;
      case 'yearly': return `برائے سال: ${selectedYear}`;
      case 'defaulters': return `آج کا دن: ${currentDateStr}`;
      case 'expenses': return `برائے مہینہ: ${selectedMonth}`;
      case 'income_expense': return `برائے سال: ${selectedYear}`;
    }
  };

  const getFilteredPayments = (): Payment[] => {
    switch (reportType) {
      case 'daily':
        return payments.filter(p => p.date === selectedDate);
      case 'monthly':
        return payments.filter(p => p.date.substring(0, 7) === selectedMonth);
      case 'yearly':
        return payments.filter(p => p.date.substring(0, 4) === selectedYear);
      case 'income_expense':
        return payments.filter(p => p.date.substring(0, 4) === selectedYear);
      default:
        return [];
    }
  };

  const getFilteredExpenses = (): Expense[] => {
    switch (reportType) {
      case 'daily':
        return expenses.filter(e => e.date === selectedDate);
      case 'monthly':
        return expenses.filter(e => e.date.substring(0, 7) === selectedMonth);
      case 'yearly':
        return expenses.filter(e => e.date.substring(0, 4) === selectedYear);
      case 'expenses':
        return expenses.filter(e => e.date.substring(0, 7) === selectedMonth);
      case 'income_expense':
        return expenses.filter(e => e.date.substring(0, 4) === selectedYear);
      default:
        return [];
    }
  };

  const currentFilteredPayments = getFilteredPayments();
  const currentFilteredExpenses = getFilteredExpenses();

  const totalPayments = currentFilteredPayments.reduce((sum, p) => sum + p.amount, 0);
  const totalExpenses = currentFilteredExpenses.reduce((sum, e) => sum + e.amount, 0);

  // Handle excel export
  const handleExport = () => {
    let filename = `دارالسلام_رپورٹ_${reportType}`;
    let headers: string[] = [];
    let rows: string[][] = [];

    if (reportType === 'defaulters') {
      const pending = members.filter(m => m.status === 'active' && m.balance > 0);
      headers = ['رکن کا نام', 'رابطہ نمبر', 'واٹس ایپ', 'ماہانہ فنڈ', 'موجودہ خالص بقایا', 'پتہ سکونت'];
      rows = pending.map(m => [
        m.name,
        m.phone,
        m.whatsapp || 'درج نہیں',
        `₨ ${m.monthlyFee}`,
        `₨ ${m.balance}`,
        m.address || 'درج نہیں'
      ]);
    } else if (reportType === 'expenses') {
      headers = ['تاریخ', 'زمرہ خرچ', 'تفصیل', 'خرچ شدہ رقم'];
      rows = currentFilteredExpenses.map(e => [
        e.date,
        e.category,
        e.description,
        `₨ ${e.amount}`
      ]);
    } else if (reportType === 'income_expense') {
      headers = ['تفصیل', 'آمدنی رقم', 'اخراجات رقم', 'نیٹ بیلنس بچت'];
      rows = [[
        `رپورٹ برائے سال ${selectedYear}`,
        `₨ ${totalPayments}`,
        `₨ ${totalExpenses}`,
        `₨ ${totalPayments - totalExpenses}`
      ]];
    } else {
      // Daily, Monthly, Yearly ledger transaction lists
      headers = ['تاریخ', 'نوعیت (آمدنی / خرچ)', 'تفصیل/نام', 'رقم'];
      const payRows = currentFilteredPayments.map(p => [
        p.date,
        'آمدنی فنڈ وصولی',
        p.memberName + (p.notes ? ` (${p.notes})` : ''),
        `₨ ${p.amount}`
      ]);
      const expRows = currentFilteredExpenses.map(e => [
        e.date,
        'مسجد خرچ',
        e.category + (e.description ? ` (${e.description})` : ''),
        `₨ ${e.amount}`
      ]);
      rows = [...payRows, ...expRows].sort((a, b) => b[0].localeCompare(a[0]));
    }

    exportToCSV(filename, headers, rows);
  };

  return (
    <div className="space-y-6 animate-fade-in" dir="rtl">
      
      {/* Printable Receipt Styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #print-report-container, #print-report-container * {
            visibility: visible;
          }
          #print-report-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white !important;
            padding: 2.5rem !important;
            direction: rtl;
            color: black !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">تفصیلی فنڈ و اخراجات رپورٹس</h2>
          <p className="text-xs text-slate-500 mt-1">مسجد کے کھاتوں کی یومیہ، ماہانہ، اور سالانہ تقابلی رپورٹیں تیار کریں، پرنٹ کریں یا ایکسل فائل لیں</p>
        </div>

        {/* Action Button tools */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleExport}
            className="bg-emerald-800 hover:bg-emerald-900 border border-emerald-700 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl flex items-center gap-1 transition-colors"
          >
            <FileSpreadsheet size={14} />
            <span>ایکسل ایکسپورٹ</span>
          </button>
          
          <button
            onClick={() => window.print()}
            className="bg-slate-850 hover:bg-slate-900 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl flex items-center gap-1 transition-colors"
          >
            <Printer size={14} />
            <span>رپورٹ پرنٹ کریں</span>
          </button>
        </div>
      </div>

      {/* Selector Filters Grid */}
      <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Date category selector */}
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-2">رپورٹ کی نوعیت منتخب کریں</label>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => setReportType('daily')}
              className={`p-2.5 rounded-lg border text-center font-semibold transition-all ${
                reportType === 'daily' ? 'bg-emerald-700 border-emerald-700 text-white font-bold' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              یومیہ رپورٹ
            </button>
            <button
              onClick={() => setReportType('monthly')}
              className={`p-2.5 rounded-lg border text-center font-semibold transition-all ${
                reportType === 'monthly' ? 'bg-emerald-700 border-emerald-700 text-white font-bold' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              ماہانہ رپورٹ
            </button>
            <button
              onClick={() => setReportType('yearly')}
              className={`p-2.5 rounded-lg border text-center font-semibold transition-all ${
                reportType === 'yearly' ? 'bg-emerald-700 border-emerald-700 text-white font-bold' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              سالانہ رپورٹ
            </button>
            <button
              onClick={() => setReportType('defaulters')}
              className={`p-2.5 rounded-lg border text-center font-semibold transition-all ${
                reportType === 'defaulters' ? 'bg-emerald-700 border-emerald-700 text-white font-bold' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              بقایا ممبران
            </button>
            <button
              onClick={() => setReportType('expenses')}
              className={`p-2.5 rounded-lg border text-center font-semibold transition-all ${
                reportType === 'expenses' ? 'bg-emerald-700 border-emerald-700 text-white font-bold' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              اخراجات رپورٹ
            </button>
            <button
              onClick={() => setReportType('income_expense')}
              className={`p-2.5 rounded-lg border text-center font-semibold transition-all ${
                reportType === 'income_expense' ? 'bg-emerald-700 border-emerald-700 text-white font-bold' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              آمدنی و اخراجات
            </button>
          </div>
        </div>

        {/* Dynamic Filters depending on the selected Type */}
        <div className="md:col-span-2 bg-slate-50/70 p-4 rounded-xl border border-slate-150 flex flex-col justify-center space-y-3">
          <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1">
            <Filter size={14} className="text-slate-500" />
            <span>رپورٹ کی تاریخ فلٹر کریں:</span>
          </h4>

          {reportType === 'daily' && (
            <div className="flex gap-2">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-white border border-slate-200 ring-emerald-500 text-xs text-right p-2.5 rounded-lg outline-none w-full"
              />
            </div>
          )}

          {(reportType === 'monthly' || reportType === 'expenses') && (
            <div className="flex gap-2">
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="bg-white border border-slate-200 ring-emerald-500 text-xs text-right p-2.5 rounded-lg outline-none w-full"
              />
            </div>
          )}

          {(reportType === 'yearly' || reportType === 'income_expense') && (
            <div className="flex gap-2">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="bg-white border border-slate-200 ring-emerald-500 text-xs p-2.5 rounded-lg outline-none w-full"
              >
                {Array.from({ length: 11 }, (_, i) => (2020 + i).toString()).map(yr => (
                  <option key={yr} value={yr}>سال {yr}ء</option>
                ))}
              </select>
            </div>
          )}

          {reportType === 'defaulters' && (
            <p className="text-xs text-slate-500 leading-relaxed italic pr-2">
              بقایا ممبران کی رپورٹ براہ راست آج کی تاریخ کے تمام فعال واجب الادا ممبران کی فہرست اخذ کرتی ہے۔
            </p>
          )}
        </div>

      </div>

      {/* Main Preview Container (Marked print identifier) */}
      <div id="print-report-container" className="bg-white p-6 rounded-2xl border border-slate-150 shadow-sm space-y-6">
        
        {/* Printable Report Header */}
        <div className="text-center space-y-1 pb-4 border-b-2 border-slate-200">
          <h3 className="text-2xl font-bold text-slate-800 font-sans tracking-tight">مسجد دارالسلام فنڈ و اخراجات رپوٹ</h3>
          <p className="text-xs text-slate-500">{getFilterDescription()}</p>
          <p className="text-[10px] text-slate-400 font-mono no-print">رپورٹ بننے کی تاریخ: {currentDateStr}</p>
        </div>

        {/* Content Render Switch */}

        {/* DEFAULTERS SPECIALIZED TABLE */}
        {reportType === 'defaulters' && (
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-700 mb-2 border-b border-slate-100 pb-1.5">موجودہ بقایا جات والے ممبران</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="border-b border-slate-200 pb-2 text-slate-600 font-bold bg-slate-50">
                    <th className="py-2.5 px-3">رکن کا نام</th>
                    <th className="py-2.5 px-3 text-center">مقررہ ماہانہ فنڈ</th>
                    <th className="py-2.5 px-3 text-center">مجموعی بقایا</th>
                    <th className="py-2.5 px-3 text-left">موبائل فون نمبر</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {members.filter(m => m.status === 'active' && m.balance > 0).map((m, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="py-2.5 px-3 font-semibold text-slate-800">{m.name}</td>
                      <td className="py-2.5 px-3 text-center">₨ {m.monthlyFee.toLocaleString()}</td>
                      <td className="py-2.5 px-3 text-center font-bold text-rose-600">₨ {m.balance.toLocaleString()}</td>
                      <td className="py-2.5 px-3 text-slate-500 text-left font-mono">{m.whatsapp || m.phone || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Total Balance Outstanding Defaulters */}
            <div className="flex justify-between items-center bg-rose-50 border border-rose-100 text-rose-800 font-bold p-3 rounded-lg text-xs">
              <span>کل بقایا جات واجب الادا:</span>
              <span className="text-sm font-black font-sans">
                ₨ {members.filter(m => m.status === 'active').reduce((sum, m) => sum + (m.balance || 0), 0).toLocaleString()} /-
              </span>
            </div>
          </div>
        )}

        {/* EXPENSES BREAKDOWN TABLE */}
        {reportType === 'expenses' && (
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-700 mb-2 border-b border-slate-100 pb-1.5">اخراجات خلاصہ فہرست</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="border-b border-slate-200 pb-2 text-slate-600 font-bold bg-slate-50">
                    <th className="py-2.5 px-3">تاریخ خرچ</th>
                    <th className="py-2.5 px-3 font-bold">زمرہ خرچ</th>
                    <th className="py-2.5 px-3">تفصیل / وضاحتی پیغام</th>
                    <th className="py-2.5 px-3 text-center">خرچ رقم</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {currentFilteredExpenses.map((e, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="py-2.5 px-3 font-mono text-slate-500">{e.date}</td>
                      <td className="py-2.5 px-3 font-semibold text-emerald-800">{e.category}</td>
                      <td className="py-2.5 px-3 text-slate-600">{e.description}</td>
                      <td className="py-2.5 px-3 text-center font-bold text-slate-800">₨ {e.amount.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Total expenses footer box */}
            <div className="flex justify-between items-center bg-red-50 border border-red-100 text-red-800 font-bold p-3 rounded-lg text-xs">
              <span>موجودہ زمرے کے کل اخراجات:</span>
              <span className="text-sm font-black font-sans">
                ₨ {totalExpenses.toLocaleString()} /-
              </span>
            </div>
          </div>
        )}

        {/* INCOME VS EXPENSES BALANCED COMPARATIVE DISPLAY */}
        {reportType === 'income_expense' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-xl">
                <span className="text-[11px] block font-bold text-emerald-600">کل سالانہ آمدنی فنڈز</span>
                <span className="text-xl font-extrabold block mt-1">₨ {totalPayments.toLocaleString()}</span>
              </div>
              <div className="p-4 bg-rose-50 border border-rose-100 text-rose-800 rounded-xl">
                <span className="text-[11px] block font-bold text-rose-600">کل سالانہ اخراجات فنڈز</span>
                <span className="text-xl font-extrabold block mt-1">₨ {totalExpenses.toLocaleString()}</span>
              </div>
              <div className="p-4 bg-slate-900 text-white rounded-xl">
                <span className="text-[11px] block font-bold text-slate-400">خالص بچت سالانہ فنڈ</span>
                <span className="text-xl font-extrabold block mt-1 text-emerald-400">
                  ₨ {(totalPayments - totalExpenses).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-700">سالانہ آمدنی و اخراجات تقابلی چارٹ</h4>
              
              {/* Responsive SVG indicator bars */}
              <div className="space-y-4 bg-slate-50 p-6 rounded-xl border border-slate-100 text-xs">
                
                {/* Income */}
                <div className="space-y-1.5Col">
                  <div className="flex justify-between font-bold text-slate-700">
                    <span>مجموعی فنڈ آمدن فنڈ:</span>
                    <span>₨ {totalPayments.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
                    <div className="bg-emerald-600 h-3" style={{ width: `${totalPayments + totalExpenses > 0 ? (totalPayments / (totalPayments + totalExpenses)) * 100 : 50}%` }}></div>
                  </div>
                </div>

                {/* Expenses */}
                <div className="space-y-1.5">
                  <div className="flex justify-between font-bold text-slate-700">
                    <span>مجموعی اخراجات فنڈ:</span>
                    <span>₨ {totalExpenses.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
                    <div className="bg-red-400 h-3" style={{ width: `${totalPayments + totalExpenses > 0 ? (totalExpenses / (totalPayments + totalExpenses)) * 100 : 50}%` }}></div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* LEDGER TRANSACTION LIST FOR DAILY/MONTHLY/YEARLY */}
        {['daily', 'monthly', 'yearly'].includes(reportType) && (
          <div className="space-y-4">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-xl text-center">
                <span className="text-[10px] block font-semibold">کل آمدن فنڈ</span>
                <span className="text-lg font-bold">₨ {totalPayments.toLocaleString()}</span>
              </div>
              <div className="p-4 bg-red-50 border border-red-100 text-red-800 rounded-xl text-center">
                <span className="text-[10px] block font-semibold col">کل اخراجات</span>
                <span className="text-lg font-bold">₨ {totalExpenses.toLocaleString()}</span>
              </div>
            </div>

            <h4 className="text-xs font-bold text-slate-700 border-b border-slate-100 pb-1.5">آمدن اور اخراجات کھاتہ ہسٹری</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="border-b border-slate-200 pb-2 text-slate-600 font-bold bg-slate-50">
                    <th className="py-2 px-3">تاریخ</th>
                    <th className="py-2 px-3">نوعیت</th>
                    <th className="py-2 px-3">تفصیلات ریکارڈ</th>
                    <th className="py-2 px-3 text-center">رقم</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {/* Map combined Payments and Expenses sorted by Date desc */}
                  {[
                    ...currentFilteredPayments.map(p => ({
                      date: p.date,
                      type: 'income',
                      typeStr: 'آمدنی فنڈ وصولی',
                      detailStr: p.memberName + (p.notes ? ` (${p.notes})` : ''),
                      amount: p.amount
                    })),
                    ...currentFilteredExpenses.map(e => ({
                      date: e.date,
                      type: 'expense',
                      typeStr: 'مسجد خرچ',
                      detailStr: e.category + ' - ' + e.description,
                      amount: e.amount
                    }))
                  ]
                    .sort((a, b) => b.date.localeCompare(a.date))
                    .map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="py-2.5 px-3 font-mono text-slate-500">{item.date}</td>
                        <td className="py-2.5 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            item.type === 'income' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                          }`}>
                            {item.typeStr}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-700 font-medium">{item.detailStr}</td>
                        <td className={`py-2.5 px-3 text-center font-bold ${item.type === 'income' ? 'text-emerald-700' : 'text-red-600'}`}>
                          ₨ {item.amount.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
