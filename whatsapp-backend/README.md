# Sahay WhatsApp Backend

Standalone FastAPI service for the SIH WhatsApp demo. It stores conversations in SQLite, receives Meta Cloud API webhooks, generates a safe fallback reply without an AI key, and sends replies through Meta when valid credentials are configured.

## Local run

```powershell
cd whatsapp-backend
Copy-Item .env.example .env
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python main.py
```

Health check: `http://localhost:8005/health`

The service seeds conversation `wa-demo-8814` on first start. The Next.js app reads it through `/api/whatsapp` and refreshes every four seconds.

## Demo injection

This lets you test the UI without sending a real WhatsApp message:

```powershell
Invoke-RestMethod -Method Post -Uri http://localhost:8005/api/whatsapp/demo/messages `
  -ContentType 'application/json' `
  -Body '{"phone_number":"+919800000014","text":"मला पोलिसांची मदत हवी आहे"}'
```

## Meta webhook

Callback URL:

```text
https://YOUR-CLOUDFLARE-URL/api/whatsapp/webhook
```

Verification token: the value of `WHATSAPP_VERIFY_TOKEN`.

The webhook accepts text messages, persists them, creates an AI response, and sends that response through Meta if `WHATSAPP_ACCESS_TOKEN` and `WHATSAPP_PHONE_NUMBER_ID` are configured. Keep `.env` private.
