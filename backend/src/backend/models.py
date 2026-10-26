from datetime import datetime

from sqlmodel import SQLModel, Field
from sqlalchemy import Column, Boolean, DateTime, text

class Item(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str = Field(max_length=30)
    is_checked: bool = Field(
        default=False,
        sa_column=Column(
            Boolean,
            nullable=False,
            server_default=text("false")
        )
    )
    purchased_date: datetime | None = Field(default=None)
    created_at: datetime | None = Field(
        default=None,
        sa_column=Column(
            DateTime,
            nullable=False,
            server_default=text("CURRENT_TIMESTAMP")
        )
    )

class ItemUpdate(SQLModel):
    name: str | None = Field(default=None, min_length=1, max_length=30)
    is_checked: bool = Field(default=False)
    purchased_date: datetime | None = None

class ItemCreate(SQLModel):
    name: str
