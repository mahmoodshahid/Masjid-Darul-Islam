/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Member, Payment, Expense } from '../types';
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Calendar, 
  ArrowLeftRight 
} from 'lucide-react';

interface DashboardProps {
  members: Member[];
  payments: Payment[];
  expenses: Expense[];
  onNavigate: (tab: string) => void;
}

export default function Dashboard({ members, payments, expenses, onNavigate }: DashboardProps) {
  const activeMembers = members.filter(m => m.status === 'active');
  const totalMembersCount = members.length;
  
  // Financial metrics
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalCollected = payments.reduce((sum, p) => sum + p.amount, 0);
  const totalDuesOutstanding = members.reduce((sum, m) => sum + (m.balance || 0), 0);
  const totalBillableCount = members.reduce((sum, m) => sum + (m.totalDue || 0), 0);
  
  // Calculate current month's numbers
  const today = new Date();
  const currentYearMonth = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}`; // e.g., "2026-06"
  
  // This Month Total Fund Billed
  const thisMonthMembers = activeMembers.filter(m => m.joiningDate.substring(0, 7) <= currentYearMonth);
  const thisMonthExpectedFund = thisMonthMembers.reduce((sum, m) => sum + m.monthlyFee, 0);
  
  // Received current month payments
  const thisMonthCollectedFund = payments
    .filter(p => p.date.substring(0, 7) === currentYearMonth)
    .reduce((sum, p) => sum + p.amount, 0);

  // Remaining list
  const pendingMembers = members.filter(m => (m.balance || 0) > 0);
  
  // Generate data for Monthly Chart (Last 6 Months)
  const getLast6MonthsLabel = () => {
    const months = [];
    const date = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(date.getFullYear(), date.getMonth() - i, 1);
      const label = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}`;
      months.push(label);
    }
    return months;
  };

  const monthsList = getLast6MonthsLabel();
  const indexToUrduMonth: { [key: string]: string } = {
    '01': 'جنوری', '02': 'فروری', '03': 'مارچ', '04': 'اپریل', '05': 'مئی', '06': 'جون',
    '07': 'جولائی', '08': 'اگست', '09': 'ستمبر', '10': 'اکتوبر', '11': 'نومبر', '12': 'دسمبر'
  };

  const getUrduMonthName = (yearMonth: string) => {
    const m = yearMonth.substring(5, 7);
    const y = yearMonth.substring(2, 4);
    return `${indexToUrduMonth[m] || m} ${y}`;
  };

  const chartData = monthsList.map(month => {
    const income = payments
      .filter(p => p.date.substring(0, 7) === month)
      .reduce((sum, p) => sum + p.amount, 0);
    const expense = expenses
      .filter(e => e.date.substring(0, 7) === month)
      .reduce((sum, e) => sum + e.amount, 0);
    return {
      monthLabel: getUrduMonthName(month),
      income,
      expense,
    };
  });

  // Find max value in chart to scale properly
  const maxChartVal = Math.max(...chartData.map(d => Math.max(d.income, d.expense, 1000)));

  return (
    <div className="space-y-6 animate-fade-in" dir="rtl">
      
      {/* Top Welcome Title */}
      <div className="bg-masjid-green text-white p-4.5 rounded-xl shadow-md relative overflow-hidden">
        <div className="absolute top-0 left-0 w-48 h-48 bg-emerald-800 rounded-full mix-blend-multiply filter blur-lg opacity-25 -translate-x-8 -translate-y-8"></div>
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-emerald-950 rounded-full mix-blend-multiply filter blur-lg opacity-40 translate-x-8 translate-y-8"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h1 className="text-xl md:text-2xl font-bold mb-1 font-sans tracking-tight text-white flex items-center gap-2">
              <span className="text-accent-gold">🕌</span>
              <span>مسجد دارالسلام فنڈ مینجمنٹ سسٹم</span>
            </h1>
            <p className="text-emerald-100 text-xs md:text-sm leading-relaxed max-w-xl">
              خوش آمدید! یہاں آپ آسانی سے مسجد کے فنڈز، ممبران کی تفصیلات، ماہانہ واجبات، اور اخراجات کا حساب کتاب رکھ سکتے ہیں۔
            </p>
          </div>
          <div className="bg-emerald-950/50 backdrop-blur-sm border border-accent-gold/20 px-3.5 py-1.5 rounded-lg text-center shrink-0 min-w-[120px]">
            <div className="text-[10px] text-emerald-200">موجودہ اسلامی سالانہ رپورٹ</div>
            <div className="text-base font-bold mt-0.5 font-sans text-accent-gold">{new Date().getFullYear()}ء</div>
          </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        
        {/* Total Members */}
        <div 
          onClick={() => onNavigate('members')}
          className="bg-white p-4 rounded-xl border border-slate-150 border-b-4 border-b-masjid-green shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-between"
          id="stat-members"
        >
          <div className="space-y-0.5">
            <span className="text-[11px] font-bold text-slate-500 block">کل ممبران</span>
            <span className="text-xl font-extrabold text-masjid-green block">{totalMembersCount}</span>
            <span className="text-[10px] text-slate-500 font-medium block">فعال ممبران: <strong className="text-masjid-green">{activeMembers.length}</strong></span>
          </div>
          <div className="p-2 border border-emerald-150 bg-masjid-light rounded-lg text-masjid-green shrink-0">
            <Users size={20} />
          </div>
        </div>

        {/* Current Month Billed */}
        <div className="bg-white p-4 rounded-xl border border-slate-150 border-b-4 border-b-accent-gold shadow-sm flex items-center justify-between" id="stat-month-total">
          <div className="space-y-0.5">
            <span className="text-[11px] font-bold text-slate-500 block">موجودہ ماہ کا فنڈ (توقع)</span>
            <span className="text-xl font-extrabold text-[#997300] block">₨ {thisMonthExpectedFund.toLocaleString()}</span>
            <span className="text-[10px] text-slate-500 font-medium block">{getUrduMonthName(currentYearMonth)}</span>
          </div>
          <div className="p-2 border border-amber-100 bg-amber-50 rounded-lg text-amber-700 shrink-0">
            <Calendar size={20} />
          </div>
        </div>

        {/* Total Collected */}
        <div 
          onClick={() => onNavigate('collection')}
          className="bg-white p-4 rounded-xl border border-slate-150 border-b-4 border-b-masjid-green shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-between"
          id="stat-collected"
        >
          <div className="space-y-0.5">
            <span className="text-[11px] font-bold text-slate-500 block">کل وصول شدہ فنڈ</span>
            <span className="text-xl font-extrabold text-masjid-green block">₨ {totalCollected.toLocaleString()}</span>
            <span className="text-[10px] text-slate-500 font-medium block">اس ماہ وصولی: <strong className="text-masjid-green">₨ {thisMonthCollectedFund.toLocaleString()}</strong></span>
          </div>
          <div className="p-2 border border-emerald-100 bg-emerald-50 rounded-lg text-masjid-green shrink-0">
            <TrendingUp size={20} />
          </div>
        </div>

        {/* Pending Fund / Deficit */}
        <div 
          onClick={() => onNavigate('defaulters')}
          className="bg-white p-4 rounded-xl border border-slate-150 border-b-4 border-b-rose-600 shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-between"
          id="stat-pending"
        >
          <div className="space-y-0.5">
            <span className="text-[11px] font-bold text-slate-500 block">کل بقایا فنڈ (واجب الادا)</span>
            <span className="text-xl font-extrabold text-rose-600 block">₨ {totalDuesOutstanding.toLocaleString()}</span>
            <span className="text-[10px] text-slate-500 font-medium block">بقایا ممبران کی تعداد: <strong className="text-rose-600">{pendingMembers.length}</strong></span>
          </div>
          <div className="p-2 border border-rose-100 bg-rose-50 rounded-lg text-rose-700 shrink-0">
            <Clock size={20} />
          </div>
        </div>

      </div>

      {/* Second Row: Detailed Balance & Expenses */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        
        {/* Net Fund Balance */}
        <div className="bg-emerald-950 text-white p-4.5 rounded-xl flex flex-col justify-between shadow-sm relative overflow-hidden border border-emerald-900 border-b-4 border-b-accent-gold">
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-accent-gold/5 rounded-full blur-2xl"></div>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-emerald-300 font-bold">بچت فنڈ (تفصیل)</span>
            <h3 className="text-xs font-semibold mt-0.5 text-slate-200">مسجد کا نیٹ فنڈ بیلنس</h3>
            <div className="text-2xl font-extrabold mt-2 font-sans text-accent-gold">
              ₨ {(totalCollected - totalExpenses).toLocaleString()}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-emerald-900 flex items-center justify-between text-[11px] text-emerald-200/80">
            <span>کل آمدن: ₨ {totalCollected.toLocaleString()}</span>
            <span>کل اخراجات: ₨ {totalExpenses.toLocaleString()}</span>
          </div>
        </div>

        {/* Total Expenses Card */}
        <div 
          onClick={() => onNavigate('expenses')}
          className="bg-white p-4 rounded-xl border border-slate-150 border-b-4 border-b-[#e53935] shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-between"
        >
          <div className="space-y-0.5">
            <span className="text-[11px] font-bold text-slate-500 block">مجموعی اخراجات مسجد</span>
            <span className="text-xl font-extrabold text-rose-600 block">₨ {totalExpenses.toLocaleString()}</span>
            <span className="text-[10px] text-slate-500 font-medium block">پیمنٹ ریکارڈز: <strong className="text-rose-600">{expenses.length}</strong></span>
          </div>
          <div className="p-2 border border-red-100 bg-red-50 rounded-lg text-rose-600 shrink-0">
            <TrendingDown size={20} />
          </div>
        </div>

        {/* Current Status Health Meter */}
        <div className="bg-white p-4 rounded-xl border border-slate-150 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 block">فنڈ ایڈمنسٹریشن کی کارکردگی</span>
            <div className="flex items-center justify-between mt-1">
              <span className="text-xs text-slate-700 font-semibold">وصولی کا تناسب</span>
              <span className="text-xs text-masjid-green font-bold">
                {totalBillableCount > 0 ? Math.round((totalCollected / totalBillableCount) * 100) : 100}%
              </span>
            </div>
            {/* Progress bar */}
            <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1.5 overflow-hidden">
              <div 
                className="bg-masjid-green h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${totalBillableCount > 0 ? Math.min(100, (totalCollected / totalBillableCount) * 100) : 100}%` }}
              ></div>
            </div>
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            موصول شدہ رقم اور واجب الادا فنڈ کا باہمی موازنہ۔
          </div>
        </div>

      </div>

      {/* Third Row: Chart of Income vs Expenses (Last 6 Months) */}
      <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-800">ماہانہ فنڈز اور اخراجات کا خلاصہ (گزشتہ 6 ماہ)</h3>
            <p className="text-xs text-slate-500 mt-1">مسجد کی آمدنی اور اخراجات کا تاریخی چارٹ پیش منظر</p>
          </div>
          
          <div className="flex items-center gap-4 text-xs font-medium">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-emerald-500 rounded-full"></span>
              <span className="text-slate-600">آمدن فنڈ</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-red-400 rounded-full"></span>
              <span className="text-slate-600">مسجد اخراجات</span>
            </div>
          </div>
        </div>

        {/* Gorgeous responsive HTML SVG bar chart */}
        <div className="h-64 w-full relative pt-4">
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
            {/* Grid background lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => (
              <div key={idx} className="w-full border-b border-dashed border-slate-100 h-0 relative">
                <span className="absolute right-0 -top-2.5 text-[9px] font-mono text-slate-400 bg-white pr-1">
                  ₨ {Math.round(maxChartVal * (1 - ratio)).toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          <div className="absolute inset-0 flex items-end justify-around px-8 md:px-12 pt-6 pb-2">
            {chartData.map((data, index) => {
              const incomeHeight = (data.income / maxChartVal) * 100;
              const expenseHeight = (data.expense / maxChartVal) * 100;
              
              return (
                <div key={index} className="flex flex-col items-center h-full justify-end w-1/6 group relative">
                  
                  {/* Hover tooltip */}
                  <div className="absolute bottom-full mb-3 bg-slate-800 text-white text-[10px] p-2 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 flex flex-col gap-1 w-36 text-center">
                    <span className="font-bold border-b border-slate-700 pb-1 block">{data.monthLabel}</span>
                    <span className="text-emerald-400 block">آمدنی: ₨ {data.income.toLocaleString()}</span>
                    <span className="text-red-400 block">اخراجات: ₨ {data.expense.toLocaleString()}</span>
                  </div>

                  <div className="flex items-end gap-1.5 md:gap-3 h-full pb-1">
                    {/* Income bar */}
                    <div 
                      className="bg-emerald-600 rounded-t-md w-4 md:w-8 hover:bg-emerald-500 transition-all duration-300 relative"
                      style={{ height: `${Math.max(2, incomeHeight)}%` }}
                    ></div>
                    {/* Expense bar */}
                    <div 
                      className="bg-red-400 rounded-t-md w-4 md:w-8 hover:bg-red-300 transition-all duration-300 relative"
                      style={{ height: `${Math.max(2, expenseHeight)}%` }}
                    ></div>
                  </div>

                  {/* Label */}
                  <span className="text-[11px] font-semibold text-slate-600 mt-2 truncate w-full text-center">
                    {data.monthLabel}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Fourth Row: Recent Payments & High pending list */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Recent Payments list */}
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-md font-bold text-slate-800">حالیہ فنڈ وصولیاں</h3>
            <button 
              onClick={() => onNavigate('collection')}
              className="text-xs text-emerald-700 font-bold hover:underline"
            >
              نیا فنڈ درج کریں ←
            </button>
          </div>
          {payments.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-sm">
              موجودہ وقت تک کوئی فنڈ وصولی ریکارڈ نہیں کی گئی۔
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="border-b border-slate-100 pb-2 text-slate-500 font-semibold">
                    <th className="py-2">نام ممبر</th>
                    <th className="py-2">وصول شدہ رقم</th>
                    <th className="py-2">تاریخ ادائیگی</th>
                    <th className="py-2 text-left">نوٹس</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {payments.slice(-5).reverse().map((p, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="py-2.5 font-semibold text-slate-800">{p.memberName}</td>
                      <td className="py-2.5 font-bold text-emerald-700">₨ {p.amount.toLocaleString()}</td>
                      <td className="py-2.5 text-slate-500">{p.date}</td>
                      <td className="py-2.5 text-slate-400 text-left max-w-[120px] truncate">{p.notes || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Top Defaulters summary */}
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-md font-bold text-slate-800">نمایاں بقایا ممبران</h3>
            <button 
              onClick={() => onNavigate('defaulters')}
              className="text-xs text-red-700 font-bold hover:underline"
            >
              تمام بقایا ممبران ←
            </button>
          </div>
          {pendingMembers.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-sm flex flex-col items-center justify-center">
              <div className="text-2xl mb-1">🎉</div>
              <span>کوئی بقایا جات نہیں ہیں۔ تمام ممبران کے واجبات ادا شدہ ہیں!</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="border-b border-slate-100 pb-2 text-slate-500 font-semibold">
                    <th className="py-2">نام ممبر</th>
                    <th className="py-2">ماہانہ فنڈ</th>
                    <th className="py-2">مجموعی بقایا</th>
                    <th className="py-2 text-left">موبائل نمبر</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {pendingMembers
                    .sort((a, b) => b.balance - a.balance)
                    .slice(0, 5)
                    .map((m, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="py-2.5 font-semibold text-slate-800">{m.name}</td>
                        <td className="py-2.5 text-slate-600">₨ {m.monthlyFee.toLocaleString()}</td>
                        <td className="py-2.5 font-bold text-rose-600">₨ {m.balance.toLocaleString()}</td>
                        <td className="py-2.5 text-slate-400 text-left font-mono">{m.whatsapp || m.phone || '-'}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
