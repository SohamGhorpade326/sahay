from __future__ import annotations

import os
from pathlib import Path
import requests

from dotenv import load_dotenv

load_dotenv(Path(__file__).with_name(".env"))
ACCESS_TOKEN = os.getenv("WHATSAPP_ACCESS_TOKEN", "").strip()
PHONE_NUMBER_ID = os.getenv("WHATSAPP_PHONE_NUMBER_ID", "").strip()
API_VERSION = os.getenv("WHATSAPP_API_VERSION", "v25.0").strip()


def configured() -> bool:
    return bool(ACCESS_TOKEN and PHONE_NUMBER_ID and ACCESS_TOKEN != "replace_me" and PHONE_NUMBER_ID != "replace_me")


def send_text(recipient: str, text: str) -> tuple[str | None, str]:
    if not configured():
        return None, "demo_only"
    response = requests.post(
        f"https://graph.facebook.com/{API_VERSION}/{PHONE_NUMBER_ID}/messages",
        headers={"Authorization": f"Bearer {ACCESS_TOKEN}"},
        json={
            "messaging_product": "whatsapp",
            "to": recipient,
            "type": "text",
            "text": {"preview_url": False, "body": text},
        },
        timeout=15,
    )
    if not response.ok:
        raise RuntimeError(f"Meta send failed ({response.status_code}): {response.text[:500]}")
    payload = response.json()
    messages = payload.get("messages") or []
    if not messages:
        raise RuntimeError(f"Meta send returned no message id: {response.text[:500]}")
    return messages[0].get("id"), "sent"
