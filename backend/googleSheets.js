const crypto = require('crypto');
const config = require('./config');

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const TOKEN_AUDIENCE = 'https://oauth2.googleapis.com/token';
const TOKEN_EXPIRY_BUFFER_SECONDS = 60;

let tokenCache = null;

function isConfigured() {
  return (
    config.googleSheets.enabled &&
    Boolean(config.googleSheets.sheetId) &&
    Boolean(config.googleSheets.serviceAccountEmail) &&
    Boolean(config.googleSheets.serviceAccountPrivateKey)
  );
}

function base64UrlEncodeJson(payload) {
  return Buffer.from(JSON.stringify(payload)).toString('base64url');
}

function base64UrlEncodeSignature(signature) {
  return Buffer.from(signature).toString('base64url');
}

async function getAccessToken() {
  if (!isConfigured()) {
    throw new Error('Google Sheets integration is not fully configured.');
  }

  const now = Math.floor(Date.now() / 1000);

  if (tokenCache && tokenCache.expiresAt - TOKEN_EXPIRY_BUFFER_SECONDS > now) {
    return tokenCache.accessToken;
  }

  const header = { alg: 'RS256', typ: 'JWT' };
  const claims = {
    iss: config.googleSheets.serviceAccountEmail,
    scope: SCOPES.join(' '),
    aud: TOKEN_AUDIENCE,
    iat: now,
    exp: now + 3600,
  };

  const encodedHeader = base64UrlEncodeJson(header);
  const encodedClaims = base64UrlEncodeJson(claims);
  const unsignedToken = `${encodedHeader}.${encodedClaims}`;

  const signer = crypto.createSign('RSA-SHA256');
  signer.update(unsignedToken);
  signer.end();
  const signature = signer.sign(config.googleSheets.serviceAccountPrivateKey);
  const encodedSignature = base64UrlEncodeSignature(signature);
  const assertion = `${unsignedToken}.${encodedSignature}`;

  const params = new URLSearchParams({
    grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
    assertion,
  });

  const response = await fetch(TOKEN_AUDIENCE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to obtain Google access token: ${response.status} ${errorText}`);
  }

  const token = await response.json();
  tokenCache = {
    accessToken: token.access_token,
    expiresAt: now + (token.expires_in || 0),
  };

  return tokenCache.accessToken;
}

function formatOrderRow(order) {
  const shipping = order.shippingInfo || {};
  const items = Array.isArray(order.items) ? order.items : [];
  const totalItems = items.reduce((acc, item) => acc + (item.quantity || 1), 0);

  return [
    order.orderNumber || '',
    order.createdAt || new Date().toISOString(),
    shipping.firstName || '',
    shipping.lastName || '',
    shipping.email || '',
    shipping.phone || '',
    shipping.address || '',
    shipping.city || '',
    shipping.state || '',
    shipping.zipCode || '',
    shipping.country || '',
    order.paymentMethod || '',
    totalItems || '',
    Number.isFinite(order.subtotal) ? order.subtotal : '',
    Number.isFinite(order.taxes) ? order.taxes : '',
    Number.isFinite(order.shipping) ? order.shipping : '',
    Number.isFinite(order.total) ? order.total : '',
    JSON.stringify(items),
  ];
}

async function appendOrder(order) {
  if (!config.googleSheets.enabled) {
    return { skipped: true };
  }

  const accessToken = await getAccessToken();
  const values = [formatOrderRow(order)];

  const endpoint = new URL(
    `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(
      config.googleSheets.sheetId
    )}/values/${encodeURIComponent(config.googleSheets.range)}:append`
  );

  endpoint.searchParams.set('valueInputOption', 'USER_ENTERED');
  endpoint.searchParams.set('insertDataOption', 'INSERT_ROWS');

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      values,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to append order to Google Sheets: ${response.status} ${errorText}`);
  }

  return { appended: true };
}

module.exports = {
  appendOrder,
  isEnabled: () => config.googleSheets.enabled,
};
