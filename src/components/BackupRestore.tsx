/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { AppData, Member, Payment, Expense } from '../types';
import { Download, Upload, Trash2, CheckCircle, AlertTriangle, ShieldCheck, Database } from 'lucide-react';

interface BackupRestoreProps {
  members: Member[];
  payments: Payment[];
  expenses: Expense[];
  lastAutoBillCheck: string;
  onRestoreData: (restoredData: AppData) => void;
  onClearAllData: () => void;
  currentDateStr: string;
}

export default function BackupRestore({
  members,
  payments,
  expenses,
  lastAutoBillCheck,
  onRestoreData,
  onClearAllData,
  currentDateStr
}: BackupRestoreProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Handle Export Backup
  const handleExportBackup = () => {
    try {
      const dataToBackup: AppData = {
        members,
        payments,
        expenses,
        lastAutoBillCheck
      };

      const jsonStr = JSON.stringify(dataToBackup, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `مسجد_دارالسلام_بیک_آپ_${currentDateStr}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setSuccessMsg('بیک اپ فائل کامیابی کے ساتھ ڈاؤن لوڈ کر دی گئی ہے۔ اسے محفوظ مقام پر رکھیں۔');
      setErrorMsg('');
      setTimeout(() => setSuccessMsg(''), 5000);
    } catch (err) {
      setErrorMsg('بک اپ بنانے کے دوران خرابی پیش آئی ہے۔');
    }
  };

  // Handle Import/Restore from file upload JSON
  const handleImportRestore = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsedData = JSON.parse(event.target?.result as string) as AppData;
        
        // Strict Validation Check
        if (
          !parsedData ||
          !Array.isArray(parsedData.members) ||
          !Array.isArray(parsedData.payments) ||
          !Array.isArray(parsedData.expenses)
        ) {
          throw new Error('درآمد کردہ فائل کا فارمیٹ درست نہیں ہے!');
        }

        // Apply Restore callback
        onRestoreData(parsedData);
        setSuccessMsg('بیک اپ ڈیٹا کامیابی کے ساتھ بحال (Restore) کر دیا گیا ہے۔ تمام فائلیں اپ ڈیٹ ہو چکی ہیں!');
        setErrorMsg('');
        setTimeout(() => setSuccessMsg(''), 5000);
      } catch (err: any) {
        setErrorMsg('ڈیٹا بحال کرنے میں خرابی: براہ کرم درست مسجد دارالسلام بیک اپ فائل اپ لوڈ کریں۔');
        setSuccessMsg('');
      }
    };
    reader.readAsText(file);
    
    // Clear input value to enable upload again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in" dir="rtl">
      
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-slate-800">بیک اپ اور ڈیٹا سیٹنگز (برقرار رکھنا)</h2>
        <p className="text-xs text-slate-500 mt-1">اپنے مسجد فنڈ ریکارڈ کا باقاعدہ بیک اپ رکھیں تاکہ کمپیوٹر خراب ہونے کی صورت میں ڈیٹا ضائع نہ ہو</p>
      </div>

      {/* Success/Error Alerts */}
      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-100 text-emerald-850 p-4 rounded-xl flex items-center gap-2.5 text-xs">
          <CheckCircle size={18} className="text-emerald-700 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="bg-rose-50 border border-rose-100 text-rose-800 p-4 rounded-xl flex items-center gap-2.5 text-xs">
          <AlertTriangle size={18} className="text-rose-700 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Backup export card */}
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <h3 className="text-md font-bold text-slate-800 flex items-center gap-2">
              <Download size={18} className="text-emerald-700" />
              <span>ڈیٹا بیک اپ لیں (Export Backup)</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              مسجد کے ممبران کی تفصیلات، فنڈ وصولیوں اور مسجد کے اخراجات کا ایک مکمل کمپیوٹر فائل بیک اپ حاصل کریں۔ یہ فائل آپ مستقبل میں کسی بھی وقت دوبارہ اپ لوڈ کر کے اپنا تمام ڈیٹا دیکھ سکتے ہیں۔
            </p>
          </div>
          <button
            onClick={handleExportBackup}
            className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 rounded-xl shadow-sm text-xs cursor-pointer transition-colors"
          >
            نئی بیک اپ فائل ڈاؤن لوڈ کریں (.JSON)
          </button>
        </div>

        {/* Restore Backup Card */}
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <h3 className="text-md font-bold text-slate-800 flex items-center gap-2">
              <Upload size={18} className="text-sky-700" />
              <span>ڈیٹا بحال کریں (Import Backup)</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              اگر آپ نے پہلے سے کوئی بیک اپ فائل بنائی ہوئی ہے، تو آپ اسے دوبارہ یہاں لوڈ کر سکتے ہیں۔ یاد رہے کہ بیک اپ فائل لوڈ کرنے سے موجودہ ریکارڈز تبدیل ہو کر پرانے بیک اپ پر منتقل ہو جائیں گے۔
            </p>
          </div>
          
          <div>
            <input
              type="file"
              ref={fileInputRef}
              accept=".json"
              onChange={handleImportRestore}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 rounded-xl shadow-sm text-xs cursor-pointer transition-colors"
            >
              کپمیوٹر سے بیک اپ منتخب کریں (.JSON)
            </button>
          </div>
        </div>

      </div>

      {/* Danger Zone & Reset */}
      <div className="bg-white p-6 rounded-xl border border-red-100 shadow-sm space-y-5">
        <h3 className="text-md font-bold text-red-600 flex items-center gap-2 border-b border-red-50/50 pb-2.5">
          <AlertTriangle size={18} />
          <span>خطرہ زون (Danger Zone)</span>
        </h3>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-slate-800">تمام فنڈ اور ممبر ڈیٹا حذف کریں</h4>
            <p className="text-xs text-slate-400 max-w-xl">
              یہ عمل ناقابل واپسی ہے۔ اس بٹن کو دبانے سے سسٹم میں موجود تمام ممبران، تاحال ادائیگیوں اور تمام اخراجات کے ریکارڈز مکمل طور پر ختم کر دیے جائیں گے۔
            </p>
          </div>
          
          <button
            onClick={() => {
              if (
                confirm('کیا آپ واقعی تمام ریکارڈز حذف کرنا چاہتے ہیں؟ یہ عمل ناقابل واپسی ہے۔') &&
                confirm('براہ کرم حتمی تصدیق کریں: کیا آپ واقعی تاحال ریکارڈز کو مٹانا چاہتے ہیں؟')
              ) {
                onClearAllData();
                setSuccessMsg('سسٹم کامیابی کے ساتھ ری سیٹ ہو گیا ہے اور تمام ریکارڈز مٹا دیے گئے ہیں۔');
                setTimeout(() => setSuccessMsg(''), 5000);
              }
            }}
            className="bg-red-50 hover:bg-red-100 border border-red-100 text-red-600 font-bold px-5 py-2.5 rounded-xl text-xs transition-colors shrink-0"
          >
            تمام ڈیٹا مستقل حذف کریں
          </button>
        </div>
      </div>

      {/* Backup Integrity Badge and Specs */}
      <div className="bg-slate-900 text-white p-5 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl">
            <ShieldCheck size={22} />
          </div>
          <div>
            <h5 className="text-xs font-bold text-slate-100">ڈیٹا سالمیت اور سیکورٹی (Encryption & Security)</h5>
            <p className="text-[10px] text-slate-400 max-w-md mt-0.5">
              دارالسلام ایپ گٹ ہب پیجز یا کسی بھی آف لائن ڈیوائس پر 100 فیصد محفوظ طریقے سے کام کرتی ہے۔ آپ کے کمپیوٹر کا تمام ڈیٹا آپ کی ذاتی براؤزر لوکل میموری میں انکرپٹ کر کے رکھا جاتا ہے۔
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-mono bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg shrink-0">
          <Database size={12} />
          <span>سائز: {JSON.stringify({ members, payments, expenses }).length} Bytes</span>
        </div>
      </div>

    </div>
  );
}
