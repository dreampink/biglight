import { google } from 'googleapis';

function normaliseKeys(row) {
  const out = {};
  for (const [k, v] of Object.entries(row)) {
    const key = k.trim().toLowerCase().replace(/\s+/g, '_');
    out[key] = (v ?? '').toString();
  }
  return out;
}
function rowsToObjects(values) {
  if (!values || values.length === 0) return [];
  const [headers, ...rows] = values;
  const raw = rows.map((r) => Object.fromEntries(headers.map((h, i) => [h, (r[i] ?? '').toString()])));
  return raw.map(normaliseKeys);
}

export async function importFromGoogleAPI(opts = {}) {
  const sheetId = opts.sheetId || process.env.SHEET_ID;
  if (!sheetId) throw new Error('ERROR: SHEET_ID is not set (env or argument).');

  const auth = await google.auth.getClient({
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });
  const sheets = google.sheets({ version: 'v4', auth });

  const tabPage = process.env.SHEET_TAB_PAGE || 'Page';
  const tabModules = process.env.SHEET_TAB_MODULES || 'Modules';
  const tabItems = process.env.SHEET_TAB_ITEMS || 'Items';

  const resp = await sheets.spreadsheets.values.batchGet({
    spreadsheetId: sheetId,
    ranges: [`'${tabPage}'!A1:Z1000`, `'${tabModules}'!A1:Z1000`, `'${tabItems}'!A1:Z1000`],
    majorDimension: 'ROWS',
  });

  const [pageVals, moduleVals, itemVals] = resp.data.valueRanges.map((v) => v.values || []);
  return {
    page: rowsToObjects(pageVals),
    modules: rowsToObjects(moduleVals),
    items: rowsToObjects(itemVals),
  };
}
