import { configs } from '@configs';
import { mkdirSync, writeFileSync } from 'fs';
import xlsx from 'node-xlsx';
import { join } from 'path';

export interface IBuildXLSX {
  /**
   * Build a worksheet, from an array of objects. Simply provide a worksheet name,
   * and an array of objects.
   *
   * Returns the path to the newly created file.
   *
   * @memberof ISheetbuilder
   */
  buildXLSX: (sheetname: string, items: unknown[]) => string;
}

/**
 * Build a worksheet, from an array of objects. Simply provide a worksheet name,
 * and an array of objects
 *
 * @export
 * @param {string} sheetname - name of your work sheet
 * @param {any[]} items - an array of objects to build sheet from
 * @returns
 */
export function buildXLSX(sheetname: string, items: unknown[]): string {
  if (!items.length) {
    return '';
  }

  // const rows = [...Array(items.length).keys()].map(a => a + 1);

  const headers: unknown[] = [];

  for (const key of Object.keys(items[0])) {
    headers.push(key.slice(0, 1).toUpperCase() + key.slice(1));
  }

  const dataRows: unknown[][] = [];

  for (const value of items) {
    dataRows.push(Object.values(value));
  }

  const data = [/* rows, */ headers, ...dataRows];

  const [columnsWidth, rowsWidth] = [[], []];

  headers.forEach(() => {
    columnsWidth.push({ wpx: 150 });
    rowsWidth.push({ hpx: 60 });
  });

  const options = { '!cols': columnsWidth, '!rows': rowsWidth };

  const buffer = xlsx.build([{ name: sheetname.length > 30 ? sheetname.slice(0, 30) : sheetname, data }], options);

  try {
    mkdirSync(join(__dirname, '..', '..', `reports`, `sheets`), { recursive: true });
  } catch {
    //
  }

  const path = join(__dirname, '..', '..', 'reports', 'sheets', `${sheetname}.xlsx`);

  writeFileSync(path, buffer as unknown as string);

  return `${configs.apiurl}/reports/sheets/${sheetname}.xlsx`;
}
