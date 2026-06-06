/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { AppData, Member, Payment, Expense } from './types';
import { runAutoBilling } from './utils/billing';

// Components
import Dashboard from './components/Dashboard';
import MemberManagement from './components/MemberManagement';
import MosqueLogo from './components/MosqueLogo';
import FundCollection from './components/FundCollection';
import Defaulters from './components/Defaulters';
import Expenses from './components/Expenses';
import Reports from './components/Reports';
import BackupRestore from './components/BackupRestore';

// Icons
import { 
  LayoutDashboard, 
  Users, 
  Wallet, 
  Clock, 
  Receipt, 
  FilePieChart, 
  Database,
  Menu,
  X,
  Sparkles,
  Volume2
} from 'lucide-react';

// Clean Empty Data for production start
const DEFAULT_APP_DATA: AppData = {
  members: [],
  payments: [],
  expenses: [],
  lastAutoBillCheck: ""
};

const LS_KEY = "darussalam_masjid_data_v2";

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // App Core Data State
  const [data, setData] = useState<AppData>(() => {
    const saved = localStorage.getItem(LS_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (err) {
        // Fallback to default
      }
    }
    return DEFAULT_APP_DATA;
  });

  // Notification state
  const [billingToast, setBillingToast] = useState<string | null>(null);

  // Helper date formatted YYYY-MM-DD
  const getTodayDateStr = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const todayStr = getTodayDateStr();

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(data));
  }, [data]);

  // Run Auto-Billing on mount exactly once
  useEffect(() => {
    // Check if we need to auto bill
    const { updatedMembers, billedCount } = runAutoBilling(data.members, todayStr);
    
    if (billedCount > 0) {
      setData(prev => ({
        ...prev,
        members: updatedMembers,
        lastAutoBillCheck: todayStr
      }));
      setBillingToast(`ماشاء اللہ! خودکار فنڈ بلنگ سسٹم نے فعال ممبران کے حسابات میں مزید ${billedCount} مہینے کے بل چارج کر دیے ہیں۔`);
      setTimeout(() => setBillingToast(null), 8000);
    }
  }, []);

  // Handlers for Member Management
  const handleAddMember = (memberData: Omit<Member, 'id' | 'balance' | 'totalPaid' | 'totalDue' | 'billedMonths'>) => {
    const newId = `member_${Date.now()}`;
    const newMember: Member = {
      ...memberData,
      id: newId,
      billedMonths: [],
      balance: 0,
      totalPaid: 0,
      totalDue: 0
    };

    // Prompt immediate auto-billing check on this specific added member
    const { updatedMembers } = runAutoBilling([newMember], todayStr);
    const resolvedMember = updatedMembers[0] || newMember;

    setData(prev => ({
      ...prev,
      members: [resolvedMember, ...prev.members]
    }));
  };

  const handleEditMember = (updatedMember: Member) => {
    setData(prev => ({
      ...prev,
      members: prev.members.map(m => m.id === updatedMember.id ? updatedMember : m)
    }));
  };

  const handleDeleteMember = (id: string) => {
    setData(prev => ({
      ...prev,
      members: prev.members.map(m => m.id === id ? { ...m, status: 'inactive' } : m)
    }));
  };

  // Handlers for Fund Collection
  const handleAddPayment = (paymentData: Omit<Payment, 'id'>): Payment => {
    const newId = `pay_${Date.now()}`;
    const newPayment: Payment = {
      ...paymentData,
      id: newId
    };

    setData(prev => {
      // Find and update the associated member balance
      const updatedMembers = prev.members.map(member => {
        if (member.id === paymentData.memberId) {
          const newBalance = Math.max(0, (member.balance || 0) - paymentData.amount);
          return {
            ...member,
            balance: newBalance,
            totalPaid: (member.totalPaid || 0) + paymentData.amount
          };
        }
        return member;
      });

      return {
        ...prev,
        payments: [...prev.payments, newPayment],
        members: updatedMembers
      };
    });

    return newPayment;
  };

  // Handlers for Expenses
  const handleAddExpense = (expenseData: Omit<Expense, 'id'>) => {
    const newId = `exp_${Date.now()}`;
    const newExpense: Expense = {
      ...expenseData,
      id: newId
    };

    setData(prev => ({
      ...prev,
      expenses: [...prev.expenses, newExpense]
    }));
  };

  const handleDeleteExpense = (id: string) => {
    setData(prev => ({
      ...prev,
      expenses: prev.expenses.filter(e => e.id !== id)
    }));
  };

  // Restore and reset data states
  const handleRestoreData = (restoredData: AppData) => {
    setData(restoredData);
  };

  const handleClearAllData = () => {
    setData({
      members: [],
      payments: [],
      expenses: [],
      lastAutoBillCheck: ""
    });
  };

  // Nav categories array
  const menuItems = [
    { id: 'dashboard', label: 'ڈیش بورڈ', icon: LayoutDashboard },
    { id: 'members', label: 'مسجد ممبران', icon: Users },
    { id: 'collection', label: 'فنڈ وصولی', icon: Wallet },
    { id: 'defaulters', label: 'بقایا جات', icon: Clock },
    { id: 'expenses', label: 'اخراجات مسجد', icon: Receipt },
    { id: 'reports', label: 'تفصیلی رپورٹیں', icon: FilePieChart },
    { id: 'settings', label: 'بیک اپ اور ڈیٹا', icon: Database },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row text-right font-sans antialiased" dir="rtl">
      
      {/* Mobile Header Bar */}
      <div className="md:hidden bg-emerald-850 text-white px-4 py-3 min-h-[56px] flex items-center justify-between shadow-md z-40 no-print">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-white rounded-full overflow-hidden shadow-inner flex items-center justify-center shrink-0">
            <MosqueLogo className="w-8 h-8" />
          </div>
          <span className="font-bold text-sm tracking-tight">مسجد دارالسلام فنڈز</span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-1 rounded-lg hover:bg-emerald-800 transition-colors focus:outline-none"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar - Desktop and Mobile wrapper */}
      <aside className={`
        fixed md:relative inset-y-0 right-0 z-30
        w-56 bg-masjid-green text-slate-100 shadow-xl border-l border-emerald-900 flex flex-col justify-between
        transition-transform duration-300 md:transform-none no-print
        ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
      `}>
        
        {/* Brand Header */}
        <div>
          <div className="p-4 border-b border-emerald-900 flex items-center gap-3 bg-emerald-950/40">
            <div className="w-10 h-10 bg-white rounded-full overflow-hidden shadow-md flex items-center justify-center shrink-0">
              <MosqueLogo className="w-9 h-9" />
            </div>
            <div>
              <span className="font-bold text-xs text-white tracking-tight block">مسجد دارالسلام</span>
              <span className="text-[9px] text-accent-gold font-semibold block uppercase">فنڈ مینجمنٹ سسٹم</span>
            </div>
          </div>
 
          {/* Navigation Items */}
          <nav className="p-2.5 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-[13px] font-medium tracking-wide transition-all duration-150 focus:outline-none text-right
                    ${isActive 
                      ? 'bg-white/15 text-white border-r-4 border-accent-gold font-semibold' 
                      : 'hover:bg-white/10 hover:text-white text-emerald-100/80'
                    }
                  `}
                >
                  <Icon size={15} className={isActive ? 'text-accent-gold' : 'text-emerald-200/50'} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
 
        {/* Footer info brand */}
        <div className="p-4 border-t border-emerald-900 bg-emerald-950/20 text-[9px] text-emerald-200/40 font-mono text-center">
          <div>ورژن 2.4.0 (آف لائن)</div>
          <div className="mt-0.5">مسجد دارالسلام کمیٹی © {new Date().getFullYear()}</div>
        </div>
 
      </aside>

      {/* Backdrop for Mobile Sidebar overlay */}
      {isMobileMenuOpen && (
        <div 
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-20 md:hidden no-print"
        ></div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        
        {/* Top Desktop navigation details */}
        <header className="hidden md:flex bg-white border-b border-slate-100 justify-between items-center px-8 py-4 sticky top-0 z-10 shadow-sm/50 no-print">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-emerald-600 rounded-full animate-pulse"></span>
            <span className="text-xs text-slate-500 font-bold">براؤزر لوکل اسٹوریج فعال اور محفوظ ہے</span>
          </div>
          <div className="text-xs font-semibold text-slate-600">
            تاريخ: <span className="font-sans font-extrabold text-slate-800">{todayStr}ء</span>
          </div>
        </header>

        {/* Dynamic Billing system Toast alerts */}
        {billingToast && (
          <div className="mx-4 md:mx-8 mt-4 animate-fade-in no-print">
            <div className="bg-emerald-50 border border-emerald-100 text-emerald-850 p-4 rounded-xl flex items-center gap-2.5 text-xs shadow-sm shadow-emerald-700/5">
              <Sparkles className="text-amber-500 fill-amber-500 shrink-0" size={16} />
              <span>{billingToast}</span>
              <button 
                onClick={() => setBillingToast(null)}
                className="mr-auto text-emerald-600 hover:text-emerald-800 text-xs font-bold"
              >
                ٹھیک ہے
              </button>
            </div>
          </div>
        )}

        {/* Rendering specific view */}
        <div className="p-4 md:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && (
            <Dashboard 
              members={data.members} 
              payments={data.payments} 
              expenses={data.expenses}
              onNavigate={(tab) => {
                setActiveTab(tab);
                window.scrollTo(0, 0);
              }}
            />
          )}

          {activeTab === 'members' && (
            <MemberManagement
              members={data.members}
              payments={data.payments}
              onAddMember={handleAddMember}
              onEditMember={handleEditMember}
              onDeleteMember={handleDeleteMember}
              currentDateStr={todayStr}
            />
          )}

          {activeTab === 'collection' && (
            <FundCollection
              members={data.members}
              payments={data.payments}
              onAddPayment={handleAddPayment}
              currentDateStr={todayStr}
            />
          )}

          {activeTab === 'defaulters' && (
            <Defaulters 
              members={data.members} 
              payments={data.payments} 
            />
          )}

          {activeTab === 'expenses' && (
            <Expenses
              expenses={data.expenses}
              onAddExpense={handleAddExpense}
              onDeleteExpense={handleDeleteExpense}
              currentDateStr={todayStr}
            />
          )}

          {activeTab === 'reports' && (
            <Reports
              members={data.members}
              payments={data.payments}
              expenses={data.expenses}
              currentDateStr={todayStr}
            />
          )}

          {activeTab === 'settings' && (
            <BackupRestore
              members={data.members}
              payments={data.payments}
              expenses={data.expenses}
              lastAutoBillCheck={data.lastAutoBillCheck}
              onRestoreData={handleRestoreData}
              onClearAllData={handleClearAllData}
              currentDateStr={todayStr}
            />
          )}
        </div>

      </main>

    </div>
  );
}
