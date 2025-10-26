function parseBoolean(value, defaultValue = false) {
  if (value === undefined || value === null) {
    return defaultValue;
  }

  if (typeof value === 'boolean') {
    return value;
  }

  const normalised = value.toString().trim().toLowerCase();
  return ['1', 'true', 'yes', 'on'].includes(normalised);
}

function normalisePrivateKey(value) {
  if (!value) {
    return undefined;
  }

  return value.replace(/\\n/g, '\n');
}

const googleSheetsEnabled = parseBoolean(process.env.GOOGLE_SHEETS_ENABLED, false);
const googleSheetsSheetId = process.env.GOOGLE_SHEETS_SHEET_ID || undefined;
const googleSheetsRange = process.env.GOOGLE_SHEETS_RANGE || 'Orders!A:Z';
const googleServiceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || undefined;
const googleServiceAccountPrivateKey = normalisePrivateKey(process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY);

module.exports = {
  googleSheets: {
    enabled: googleSheetsEnabled,
    sheetId: googleSheetsSheetId,
    range: googleSheetsRange,
    serviceAccountEmail: googleServiceAccountEmail,
    serviceAccountPrivateKey: googleServiceAccountPrivateKey,
  },
};
