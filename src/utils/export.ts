/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Exports data to a CSV file with proper UTF-8 BOM representation for Excel Urdu support.
 */
export function exportToCSV(filename: string, headers: string[], rows: string[][]) {
  const csvContent = [
    headers.join(','),
    ...rows.map(row =>
      row
        .map(val => {
          const cleanVal = (val || '').toString().replace(/"/g, '""');
          return cleanVal.includes(',') || cleanVal.includes('\n') || cleanVal.includes('"')
            ? `"${cleanVal}"`
            : cleanVal;
        })
        .join(',')
    )
  ].join('\n');

  // Prepend UTF-8 BOM \uFEFF to support Urdu and other non-ASCII characters in Excel
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
