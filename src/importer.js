import fs from 'fs/promises';
import { parse } from 'csv-parse/sync';

export async function readCSV(p){ const t = await fs.readFile(p,'utf8'); return parse(t,{columns:true,skip_empty_lines:true,trim:true}); }
export async function importAll(dir='data'){
  const page = await readCSV(`${dir}/page.csv`);
  const modules = await readCSV(`${dir}/modules.csv`);
  const items = await readCSV(`${dir}/items.csv`);
  return { page, modules, items };
}
