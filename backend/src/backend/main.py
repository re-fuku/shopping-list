from fastapi import FastAPI, Depends, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel, Session, select, update
from datetime import datetime, timezone

from backend import models
from backend.database import engine, get_session
from backend.models import ItemCreate

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


SQLModel.metadata.create_all(engine)

@app.get("/items")
def get_items(session: Session = Depends(get_session)):
    statement = select(models.Item)
    items = session.exec(statement).all()

    return items

@app.post("/items")
def add_item(item_data: ItemCreate, session: Session = Depends(get_session)):
    item = models.Item(name=item_data.name)

    session.add(item)
    session.commit()
    session.refresh(item)

    return item

@app.patch("/items/purchase-date")
def regist_purchase(session: Session = Depends(get_session)):
    statement = (
        update(models.Item)
        .where(
            models.Item.is_purchased == True,
            models.Item.purchased_date == None
        )
        .values(purchased_date=datetime.now(timezone.utc))
    )

    result = session.execute(statement)
    session.commit()

    return {"update_count": result.rowcount}

@app.delete("/items/{item_id}")
def delete_item(item_id: int, session: Session = Depends(get_session)):
    item = session.get(models.Item, item_id)

    if item is None:
        raise HTTPException(
            status_code=404,
            detail="Item not found"
        )

    session.delete(item)
    session.commit()

    return {"message": "アイテム削除成功"}

@app.patch("/items/{item_id}")
def update_item(item_id: int, item_data: models.ItemUpdate = Form(), session: Session = Depends(get_session)):
    item = session.get(models.Item, item_id)

    if item is None:
        raise HTTPException(status_code=404, detail="Item not found")

    update_data = item_data.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(item, key, value)

    session.commit()
    session.refresh(item)

    return item