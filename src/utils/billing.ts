/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Member } from '../types';

/**
 * Helper to get all months (as YYYY-MM) between two dates.
 * e.g., getMonthsBetweenStatus("2026-03-15", "2026-06-06") -> ["2026-03", "2026-04", "2026-05", "2026-06"]
 */
export function getMonthsBetween(startDateStr: string, endDateStr: string): string[] {
  const startYear = parseInt(startDateStr.substring(0, 4));
  const startMonth = parseInt(startDateStr.substring(5, 7));
  
  const endYear = parseInt(endDateStr.substring(0, 4));
  const endMonth = parseInt(endDateStr.substring(5, 7));

  const months: string[] = [];
  
  // Start date should be valid
  if (isNaN(startYear) || isNaN(startMonth) || isNaN(endYear) || isNaN(endMonth)) {
    return [];
  }

  let currYear = startYear;
  let currMonth = startMonth;

  while (
    currYear < endYear || 
    (currYear === endYear && currMonth <= endMonth)
  ) {
    const monthStr = `${currYear}-${currMonth.toString().padStart(2, '0')}`;
    months.push(monthStr);
    
    currMonth++;
    if (currMonth > 12) {
      currMonth = 1;
      currYear++;
    }
  }

  return months;
}

/**
 * Runs the auto-billing engine on all active members.
 * Returns the updated list of members and the count of newly auto-billed months generated.
 */
export function runAutoBilling(members: Member[], currentDateStr: string): { updatedMembers: Member[]; billedCount: number } {
  let billedCount = 0;
  
  const updatedMembers = members.map(member => {
    if (member.status !== 'active') {
      return member;
    }

    // Skip if joining date is invalid or in the future
    if (!member.joiningDate || member.joiningDate > currentDateStr) {
      return member;
    }

    const joiningMonth = member.joiningDate.substring(0, 7); // YYYY-MM
    const targetMonths = getMonthsBetween(member.joiningDate, currentDateStr);

    const newBilledMonths = [...(member.billedMonths || [])];
    let extraDues = 0;

    targetMonths.forEach(month => {
      if (!newBilledMonths.includes(month)) {
        newBilledMonths.push(month);
        extraDues += member.monthlyFee;
        billedCount++;
      }
    });

    if (extraDues > 0) {
      return {
        ...member,
        billedMonths: newBilledMonths,
        balance: (member.balance || 0) + extraDues,
        totalDue: (member.totalDue || 0) + extraDues
      };
    }

    return member;
  });

  return { updatedMembers, billedCount };
}
