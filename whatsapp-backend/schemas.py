from __future__ import annotations

from pydantic import BaseModel, Field


class DemoMessageRequest(BaseModel):
    phone_number: str = "+919800000014"
    text: str = Field(min_length=1, max_length=4000)
    conversation_id: str | None = None


class MessageResponse(BaseModel):
    id: int
    conversation_id: str
    direction: str
    sender_label: str
    text: str
    message_type: str
    provider_message_id: str | None = None
    delivery_status: str
    created_at: str
    metadata: dict


class ConversationResponse(BaseModel):
    conversation_id: str
    phone_number: str
    display_name: str
    status: str
    detected_language: str
    distress_level: str
    case_id: str | None
    created_at: str
    updated_at: str


class ConversationDetail(ConversationResponse):
    messages: list[MessageResponse]
