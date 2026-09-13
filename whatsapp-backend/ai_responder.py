from __future__ import annotations

import os
import requests

from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "").strip()
GROQ_MODEL = os.getenv("GROQ_MODEL", "llama-3.1-8b-instant")


def fallback_reply(text: str) -> tuple[str, str, str, list[str]]:
    lowered = text.lower()
    about_sahay = any(
        phrase in lowered
        for phrase in [
            "what can sahay do",
            "what is sahay",
            "about sahay",
            "features",
            "how can sahay help",
            "what help do you provide",
        ]
    )
    if about_sahay:
        return (
            "Sahay is a confidential victim-support system with five connected features:\n\n"
            "1. Victim Support: share a concern through WhatsApp, SMS, the app, or IVRS and receive a guided support response.\n\n"
            "2. Aashwas Distress Score: identifies distress signals and helps prioritize urgent cases. It is a support-prioritization tool, not a medical diagnosis.\n\n"
            "3. Raksha Safe Check: helps you assess immediate danger, think through a safer next step, and request urgent support.\n\n"
            "4. Nyaya Legal Navigator: explains general reporting steps, legal-aid access, witness protection, court stages, and relief pathways. It does not replace a lawyer.\n\n"
            "5. Sankalp Command Centre: helps authorized support teams coordinate safety escalation, legal-aid assignment, counselor referral, and case review.\n\n"
            "You can tell me what happened, ask for a safety check, ask about legal-aid process, or request the next Sahay support step. If you are in immediate danger, move to a safer place and contact 112 in India.",
            "English",
            "Medium",
            ["SAHAY OVERVIEW", "FEATURES EXPLAINED"],
        )
    urgent = any(word in lowered for word in ["danger", "help", "police", "suicide", "मार", "धोका", "मदत"])
    if urgent:
        return (
            "Your message has been received. If you are in immediate danger, move to a safer place and contact 112. A Sahay support officer will follow up.",
            "English",
            "High",
            ["URGENT SAFETY REVIEW", "112 EMERGENCY GUIDANCE"],
        )
    return (
        "Your confidential request has been logged. Sahay will help you understand the next support step.",
        "English",
        "Medium",
        ["CASE LOGGED"],
    )


def generate_reply(text: str) -> tuple[str, str, str, list[str]]:
    lowered = text.lower()
    if any(
        phrase in lowered
        for phrase in [
            "what can sahay do",
            "what is sahay",
            "about sahay",
            "features",
            "how can sahay help",
            "what help do you provide",
        ]
    ):
        return fallback_reply(text)
    if not GROQ_API_KEY:
        return fallback_reply(text)
    try:
        response = requests.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={"Authorization": f"Bearer {GROQ_API_KEY}"},
            json={
                "model": GROQ_MODEL,
                "temperature": 0.2,
                "messages": [
                    {"role": "system", "content": """You are Sahay AI, the English-only WhatsApp support assistant for the Sahay victim-support application.

Sahay has five support areas:
1. Sahay Victim Support: confidential multilingual check-in, WhatsApp/SMS/app/IVRS intake, support requests, and counselor follow-up.
2. Aashwas Distress Score: records distress signals and prioritizes urgent support. It is not a medical diagnosis.
3. Raksha Safe Check: helps assess immediate danger and create a practical safety check-in.
4. Nyaya Legal Navigator: explains general process guidance around reporting, legal aid, witness protection, court stages, and relief. It is not a lawyer and must not promise legal outcomes.
5. Sankalp Command Centre: coordinates support actions such as police safety escalation, legal-aid assignment, counselor referral, and case review.

Reply in English only, even if the user writes in another language. Be concise, calm, trauma-informed, and directly related to Sahay. For immediate danger, advise the user to move to a safer place and contact local emergency services such as 112 in India. Do not invent case status, appointments, officers, laws, money, or actions that Sahay has not confirmed. Do not claim to be a police officer, doctor, lawyer, or human counselor. If a question is unrelated to Sahay, say that you can help only with Sahay support, safety check-ins, distress signals, legal-aid guidance, or support coordination. Return only the reply text."""},
                    {"role": "user", "content": text},
                ],
            },
            timeout=15,
        )
        response.raise_for_status()
        reply = response.json()["choices"][0]["message"]["content"].strip()
        _, language, distress, tags = fallback_reply(text)
        return reply, language, distress, tags
    except (requests.RequestException, KeyError, IndexError, TypeError):
        return fallback_reply(text)
