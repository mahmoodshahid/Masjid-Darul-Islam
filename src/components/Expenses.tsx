/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Expense, ExpenseCategory } from '../types';
import { Plus, Search, Trash2, Calendar, FileText, ChevronLeft, DollarSign } from 'lucide-react';

interface ExpensesProps {
  expenses: Expense[];
  onAddExpense: (expenseData: Omit<Expense, 'id'>) => void;
  onDeleteExpense: (id: string) => void;
  currentDateStr: string;
}

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  'امام صاحب وظیفہ',
  'مؤذن صاحب وظیفہ',
  'بجلی بل',
  'گیس بل',
  'صفائی',
  'مرمت',
  'تعمیرات',
  'دیگر'
];

export default function Expenses({
  expenses,
  onAddExpense,
  onDeleteExpense,
  currentDateStr
}: ExpensesProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Form states
  const [amount, setAmount] = useState<number | ''>('');
  const [date, setDate] = useState(currentDateStr);
  const [category, setCategory] = useState<ExpenseCategory>('بجلی بل');
  const [description, setDescription] = useState('');

  const resetForm = () => {
    setAmount('');
    setDate(currentDateStr);
    setCategory('بجلی بل');
    setDescription('');
    setIsFormOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return;

    onAddExpense({
      date,
      category,
      description,
      amount: Number(amount)
    });

    resetForm();
  };

  const filteredExpenses = expenses.filter(e =>
    e.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Totals by Category for summary statistics
  const getCategoryTotal = (cat: ExpenseCategory) => {
    return expenses
      .filter(e => e.category === cat)
      .reduce((sum, e) => sum + e.amount, 0);
  };

  const grandTotalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="space-y-6 animate-fade-in" dir="rtl">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">اخراجات مسجد (اندراج و ڈیش بورڈ)</h2>
          <p className="text-xs text-slate-500 mt-1">مسجد دارالسلام کے تمام روزمرہ اور ماہانہ اخراجات (بجلی بل، گیس بل، وظائف) شیڈول کریں</p>
        </div>

        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2.5 rounded-xl shadow-sm text-sm font-semibold flex items-center gap-1.5 self-start sm:self-auto transition-colors"
        >
          <Plus size={18} />
          <span>نیا خرچ درج کریں</span>
        </button>
      </div>

      {/* Grid of category breakdowns */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {EXPENSE_CATEGORIES.slice(0, 4).map((cat, idx) => (
          <div key={idx} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
            <span className="text-[10px] font-bold text-slate-400 block">{cat}</span>
            <span className="text-base font-extrabold text-slate-800 block mt-1">
              ₨ {getCategoryTotal(cat).toLocaleString()}
            </span>
          </div>
        ))}
        {EXPENSE_CATEGORIES.slice(4).map((cat, idx) => (
          <div key={idx} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
            <span className="text-[10px] font-bold text-slate-400 block">{cat}</span>
            <span className="text-base font-extrabold text-slate-800 block mt-1">
              ₨ {getCategoryTotal(cat).toLocaleString()}
            </span>
          </div>
        ))}
      </div>

      {/* Search Input Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
        <div className="relative">
          <input
            type="text"
            placeholder="زمرہ، تفصیل یا حوالہ تلاش کریں..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-10 pl-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-emerald-500 transition-colors"
          />
          <Search className="absolute right-3 top-2.5 text-slate-400" size={18} />
        </div>
      </div>

      {/* Expenses List Table */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        {filteredExpenses.length === 0 ? (
          <div className="text-center py-16 text-slate-400 space-y-3">
            <DollarSign size={48} className="mx-auto text-slate-300 stroke-1" />
            <p className="text-sm">ابھی تک کوئی خرچ درج نہیں کیا گیا۔</p>
          </div>
        ) : (
          <div>
            <div className="overflow-x-auto">
              <table className="w-full text-right text-sm">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                  <tr>
                    <th className="py-3 px-4">تاریخ</th>
                    <th className="py-3 px-4">زمرہ خرچ</th>
                    <th className="py-3 px-4">تفصیل / وضاحت</th>
                    <th className="py-3 px-4 text-center">رقم</th>
                    <th className="py-3 px-4 text-left">کارروائی</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredExpenses.map((expense) => (
                    <tr key={expense.id} className="hover:bg-slate-50/40 transition-colors">
                      <td className="py-3.5 px-4 text-slate-500 font-mono text-xs">{expense.date}</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-100/50">
                          {expense.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-700 max-w-[240px] truncate" title={expense.description}>
                        {expense.description || '-'}
                      </td>
                      <td className="py-3.5 px-4 text-center font-extrabold text-slate-800">₨ {expense.amount.toLocaleString()}</td>
                      <td className="py-3.5 px-4 text-left">
                        <button
                          onClick={() => {
                            if (confirm('کیا آپ واقعی یہ خرچ حذف کرنا چاہتے ہیں؟')) {
                              onDeleteExpense(expense.id);
                            }
                          }}
                          className="bg-red-50 hover:bg-red-100 text-red-600 p-1.5 rounded-lg border border-red-100 transition-colors"
                          title="حذف کریں"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Total Footer */}
            <div className="bg-slate-900 text-white p-4 flex justify-between items-center text-sm font-bold">
              <span>مجموعی اخراجات فنڈ:</span>
              <span className="text-base text-red-400 font-extrabold font-sans">
                ₨ {grandTotalExpenses.toLocaleString()} /-
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Add Expense Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white max-w-md w-full rounded-2xl border border-slate-100 shadow-xl overflow-hidden animate-scale-up text-right">
            
            {/* Header */}
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800">نیا خرچ درج کریں</h3>
              <button 
                onClick={resetForm}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                منسوخ
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              
              {/* Category selector */}
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">زمرہ منتخب کریں *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:border-emerald-500 bg-white"
                >
                  {EXPENSE_CATEGORIES.map((cat, idx) => (
                    <option key={idx} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Amount and payments date fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">رقم (روپے) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    placeholder="مثال: 1500"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5 font-sans">تاریخ خرچ *</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:border-emerald-500 text-left"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">تفصیلی وضاحت / نوٹس</label>
                <textarea
                  rows={3}
                  required
                  placeholder="مثال: مسجد کا بل برائے ماہ مئی"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Action columns */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={resetForm}
                  className="border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-xl text-xs"
                >
                  منسوخ کریں
                </button>
                <button
                  type="submit"
                  className="bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-2 rounded-xl text-xs font-semibold"
                >
                  محفوظ کریں
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
