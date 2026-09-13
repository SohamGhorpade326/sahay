from __future__ import annotations

import hashlib
import hmac
import json
import os
from contextlib import asynccontextmanager
from typing import Any

from dotenv import load_dotenv
from fastapi import FastAPI, Header, HTTPException, Query, Request
from fastapi.responses import PlainTextResponse
from fastapi.middleware.cors import CORSMiddleware

import db
from ai_responder import generate_reply
from meta_client import send_text
from schemas import ConversationDetail, ConversationResponse, DemoMessageRequest, MessageResponse

load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))
VERIFY_TOKEN = os.getenv("WHATSAPP_VERIFY_TOKEN", "sahay-sih-demo-2026")
APP_SECRET = os.getenv("META_APP_SECRET", "").strip()


@asynccontextmanager
async def lifespan(_: FastAPI):
    db.init_db()
    db.seed_demo_conversation()
    yield


app = FastAPI(title="Sahay WhatsApp Backend", version="1.0.0", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("FRONTEND_URL", "http://localhost:3000"), "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def verify_signature(raw_body: bytes, signature: str | None) -> bool:
    if not APP_SECRET or APP_SECRET == "replace_me":
        return True
    if not signature or not signature.startswith("sha256="):
        return False
    expected = hmac.new(APP_SECRET.encode(), raw_body, hashlib.sha256).hexdigest()
    return hmac.compare_digest(signature.removeprefix("sha256="), expected)


def process_inbound(phone_number: str, text: str, conversation_id: str | None = None, provider_id: str | None = None) -> dict[str, Any]:
    resolved_id = db.ensure_conversation(phone_number, conversation_id)
    inbound = db.add_message(resolved_id, "inbound", text, "Victim", provider_message_id=provider_id, delivery_status="received")
    print(f"[WHATSAPP] inbound message from {phone_number}: {text[:120]}", flush=True)
    reply, language, distress, tags = generate_reply(text)
    try:
        outbound_provider_id, delivery = send_text(phone_number, reply)
    except Exception as error:
        outbound_provider_id, delivery = None, f"send_failed: {type(error).__name__}"
        print(f"[WHATSAPP] outbound reply failed: {error}", flush=True)
    else:
        print(f"[WHATSAPP] outbound reply delivery={delivery} provider_id={outbound_provider_id}", flush=True)
    db.update_analysis(resolved_id, language, distress, tags)
    outbound = db.add_message(
        resolved_id,
        "outbound",
        reply,
        "SAHAY AI",
        provider_message_id=outbound_provider_id,
        delivery_status=delivery,
        metadata={"language": language, "distress_level": distress, "tags": tags},
    )
    return {"conversation_id": resolved_id, "inbound": inbound, "outbound": outbound}


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "whatsapp-backend"}


@app.get("/api/whatsapp/conversations", response_model=list[ConversationResponse])
def conversations() -> list[dict[str, Any]]:
    return db.get_conversations()


@app.get("/api/whatsapp/conversations/{conversation_id}", response_model=ConversationDetail)
def conversation(conversation_id: str) -> dict[str, Any]:
    item = db.get_conversation(conversation_id)
    if not item:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return {**item, "messages": db.get_messages(conversation_id)}


@app.post("/api/whatsapp/demo/messages")
def demo_message(body: DemoMessageRequest) -> dict[str, Any]:
    return process_inbound(body.phone_number, body.text, body.conversation_id)


@app.get("/api/whatsapp/webhook", response_class=PlainTextResponse)
def verify_webhook(
    hub_mode: str = Query("", alias="hub.mode"),
    hub_verify_token: str = Query("", alias="hub.verify_token"),
    hub_challenge: str = Query("", alias="hub.challenge"),
) -> str:
    if hub_mode == "subscribe" and hub_verify_token == VERIFY_TOKEN:
        return hub_challenge
    raise HTTPException(status_code=403, detail="Webhook verification failed")


@app.post("/api/whatsapp/webhook")
async def webhook(request: Request, x_hub_signature_256: str | None = Header(default=None)) -> dict[str, Any]:
    raw_body = await request.body()
    if not verify_signature(raw_body, x_hub_signature_256):
        raise HTTPException(status_code=403, detail="Invalid webhook signature")
    payload = json.loads(raw_body or b"{}")
    processed = 0
    for entry in payload.get("entry", []):
        for change in entry.get("changes", []):
            value = change.get("value", {})
            for message in value.get("messages", []):
                if message.get("type") != "text":
                    continue
                contacts = value.get("contacts", [])
                phone = message.get("from") or (contacts[0].get("wa_id") if contacts else "")
                text = message.get("text", {}).get("body", "").strip()
                if phone and text:
                    process_inbound(phone, text, provider_id=message.get("id"))
                    processed += 1
    return {"status": "ok", "processed": processed}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host=os.getenv("API_HOST", "0.0.0.0"), port=int(os.getenv("API_PORT", "8005")))
