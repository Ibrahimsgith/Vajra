<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1f93sGxN6OehVzaIBgDRwFPEBuVDNmOlw

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Backend storage

The API persists products and orders to JSON files located in `backend/data`. No database server is required for local development or deployment.

## Google Sheets order logging

The backend can optionally log each order to a Google Sheet for lightweight reporting. Configure the integration with the following environment variables:

- `GOOGLE_SHEETS_ENABLED` – Set to `true` to enable the integration. When omitted or `false`, the API skips the Google Sheets call.
- `GOOGLE_SHEETS_SHEET_ID` – The ID portion of the target Google Sheet URL (the string between `/d/` and `/edit`).
- `GOOGLE_SHEETS_RANGE` (optional) – The range to append to. Defaults to `Orders!A:Z`.
- `GOOGLE_SERVICE_ACCOUNT_EMAIL` – Email address of the Google service account that has access to the sheet.
- `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` – Private key for the service account. Copy the `private_key` value from the JSON key and replace literal newlines with `\n` when storing in environment variables.

### Setup steps

1. Create a Google Cloud project (or reuse an existing one) and enable the Google Sheets API.
2. Generate a **service account** and create a JSON key. The file includes the email and private key required above.
3. Share the destination Google Sheet with the service account's email address as an editor.
4. Provide the environment variables to your deployment (for example via `.env` files or your hosting platform's secret manager).

When enabled, the `/api/orders` endpoint appends a new row for each order. Any errors that occur while writing to Google Sheets are logged but do not block order placement.
