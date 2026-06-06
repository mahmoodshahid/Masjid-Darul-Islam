/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Member {
  id: string;
  name: string;
  phone: string;
  whatsapp: string;
  address: string;
  monthlyFee: number;
  joiningDate: string; // YYYY-MM-DD
  notes: string;
  status: 'active' | 'inactive';
  billedMonths: string[]; // List of months already billed, e.g., ["2026-04", "2026-05", "2026-06"]
  balance: number; // outstanding dues (بقایا)
  totalPaid: number; // total amount paid to date
  totalDue: number; // total amount billed to date
}

export interface Payment {
  id: string;
  memberId: string;
  memberName: string;
  amount: number;
  date: string; // YYYY-MM-DD
  notes: string;
}

export interface Expense {
  id: string;
  date: string; // YYYY-MM-DD
  category: ExpenseCategory;
  description: string;
  amount: number;
}

export type ExpenseCategory =
  | 'امام صاحب وظیفہ'
  | 'مؤذن صاحب وظیفہ'
  | 'بجلی بل'
  | 'گیس بل'
  | 'صفائی'
  | 'مرمت'
  | 'تعمیرات'
  | 'دیگر';

export interface AppData {
  members: Member[];
  payments: Payment[];
  expenses: Expense[];
  lastAutoBillCheck: string; // YYYY-MM-DD
}
