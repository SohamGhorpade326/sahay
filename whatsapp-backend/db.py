from __future__ import annotations

import json
import os
import sqlite3
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from dotenv import load_dotenv

load_dotenv()
DB_PATH = os.getenv("DB_PATH", "./data/whatsapp.db")


def _connect() -> sqlite3.Connection:
    Path(DB_PATH).parent.mkdir(parents=True, exist_ok=True)
    connection = sqlite3.connect(DB_PATH)
    connection.row_factory = sqlite3.Row
    connection.execute("PRAGMA journal_mode=WAL")
    return connection


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def init_db() -> None:
    with _connect() as connection:
        connection.executescript(
            """
            CREATE TABLE IF NOT EXISTS conversations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                conversation_id TEXT NOT NULL UNIQUE,
                phone_number TEXT NOT NULL,
                display_name TEXT NOT NULL,
                status TEXT NOT NULL DEFAULT 'active',
                detected_language TEXT NOT NULL DEFAULT 'Marathi',
                distress_level TEXT NOT NULL DEFAULT 'Medium',
                case_id TEXT,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                conversation_id TEXT NOT NULL,
                direction TEXT NOT NULL CHECK(direction IN ('inbound', 'outbound')),
                sender_label TEXT NOT NULL,
                text TEXT NOT NULL,
                message_type TEXT NOT NULL DEFAULT 'text',
                provider_message_id TEXT,
                delivery_status TEXT NOT NULL DEFAULT 'stored',
                created_at TEXT NOT NULL,
                metadata_json TEXT NOT NULL DEFAULT '{}',
                FOREIGN KEY(conversation_id) REFERENCES conversations(conversation_id)
            );
            CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id, id);
            """
        )


def seed_demo_conversation() -> None:
    with _connect() as connection:
        existing = connection.execute(
            "SELECT 1 FROM conversations WHERE conversation_id = ?",
            ("wa-demo-8814",),
        ).fetchone()
        if existing:
            return
        created = now_iso()
        connection.execute(
            """
            INSERT INTO conversations
            (conversation_id, phone_number, display_name, detected_language, distress_level, case_id, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """,
            ("wa-demo-8814", "+919800000014", "Demo victim", "Marathi", "High", "MH-2841", created, created),
        )
        messages = [
            ("inbound", "Victim", "मला केसच्या पुढील तारखेबद्दल भीती वाटत आहे...", "2026-09-08T10:42:00+00:00"),
            ("outbound", "SAHAY AI", "आम्ही तुमची भीती समजून घेतली आहे. NALSA कायदेशीर सहाय्यक अधिकारी तुमच्याशी जोडले जात आहेत.", "2026-09-08T10:43:00+00:00"),
        ]
        for direction, sender, text, timestamp in messages:
            connection.execute(
                """
                INSERT INTO messages (conversation_id, direction, sender_label, text, created_at)
                VALUES (?, ?, ?, ?, ?)
                """,
                ("wa-demo-8814", direction, sender, text, timestamp),
            )
        connection.commit()


def get_conversations() -> list[dict[str, Any]]:
    with _connect() as connection:
        rows = connection.execute(
            "SELECT * FROM conversations ORDER BY updated_at DESC"
        ).fetchall()
        return [dict(row) for row in rows]


def get_conversation(conversation_id: str) -> dict[str, Any] | None:
    with _connect() as connection:
        row = connection.execute(
            "SELECT * FROM conversations WHERE conversation_id = ?",
            (conversation_id,),
        ).fetchone()
        return dict(row) if row else None


def get_messages(conversation_id: str) -> list[dict[str, Any]]:
    with _connect() as connection:
        rows = connection.execute(
            "SELECT * FROM messages WHERE conversation_id = ? ORDER BY id ASC",
            (conversation_id,),
        ).fetchall()
        return [
            {**dict(row), "metadata": json.loads(row["metadata_json"] or "{}")} for row in rows
        ]


def ensure_conversation(phone_number: str, conversation_id: str | None = None) -> str:
    resolved_id = conversation_id or f"wa-{phone_number.replace('+', '')}"
    timestamp = now_iso()
    with _connect() as connection:
        connection.execute(
            """
            INSERT INTO conversations
            (conversation_id, phone_number, display_name, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?)
            ON CONFLICT(conversation_id) DO UPDATE SET updated_at = excluded.updated_at
            """,
            (resolved_id, phone_number, phone_number, timestamp, timestamp),
        )
        connection.commit()
    return resolved_id


def add_message(
    conversation_id: str,
    direction: str,
    text: str,
    sender_label: str,
    message_type: str = "text",
    provider_message_id: str | None = None,
    delivery_status: str = "stored",
    metadata: dict[str, Any] | None = None,
) -> dict[str, Any]:
    timestamp = now_iso()
    with _connect() as connection:
        cursor = connection.execute(
            """
            INSERT INTO messages
            (conversation_id, direction, sender_label, text, message_type, provider_message_id, delivery_status, created_at, metadata_json)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (conversation_id, direction, sender_label, text, message_type, provider_message_id, delivery_status, timestamp, json.dumps(metadata or {})),
        )
        connection.execute(
            "UPDATE conversations SET updated_at = ? WHERE conversation_id = ?",
            (timestamp, conversation_id),
        )
        connection.commit()
        row = connection.execute("SELECT * FROM messages WHERE id = ?", (cursor.lastrowid,)).fetchone()
        return {**dict(row), "metadata": json.loads(row["metadata_json"] or "{}")}


def update_analysis(conversation_id: str, language: str, distress_level: str, tags: list[str]) -> None:
    with _connect() as connection:
        connection.execute(
            """
            UPDATE conversations
            SET detected_language = ?, distress_level = ?, updated_at = ?
            WHERE conversation_id = ?
            """,
            (language, distress_level, now_iso(), conversation_id),
        )
        connection.commit()
