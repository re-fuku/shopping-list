from fastapi import FastAPI, Depends, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel, Session, select, update
from datetime import datetime, timezone

from backend.database import engine, get_session
from backend.models import Item, ItemCreate, ItemUpdate

app = FastAPI(
    title="買い物リスト API",
    description="""
買い物リストのデータを操作するためのREST API

## 主な機能
- 商品の取得・登録・更新・削除
""",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


SQLModel.metadata.create_all(engine)

@app.get(
    "/items",
    summary="アイテム一覧を取得",
    description="DBからアイテム一覧を取得"    
)
def get_items(session: Session = Depends(get_session)):
    statement = select(Item)
    items = session.exec(statement).all()

    return items

@app.post(
    "/items",
    summary="アイテムの追加",
    description="DBへアイテムを追加",
)
def add_item(item_data: ItemCreate, session: Session = Depends(get_session)):
    item = Item(name=item_data.name)

    session.add(item)
    session.commit()
    session.refresh(item)

    return item

@app.patch(
    "/items/purchase-date",
    summary="購入日付の登録",
    description="チェック済みのアイテムの購入日付を実行日時で登録する",
)
def regist_purchase(session: Session = Depends(get_session)):
    statement = (
        update(Item)
        .where(
            Item.is_checked == True,
            Item.purchased_date == None
        )
        .values(purchased_date=datetime.now(timezone.utc))
    )

    result = session.execute(statement)
    session.commit()

    return {"update_count": result.rowcount}

@app.delete(
    "/items/{item_id}",
    summary="アイテムを削除",
    description="指定したitem_idのアイテムを削除する",

)
def delete_item(item_id: int, session: Session = Depends(get_session)):
    item = session.get(Item, item_id)

    if item is None:
        raise HTTPException(
            status_code=404,
            detail="Item not found"
        )

    session.delete(item)
    session.commit()

    return {"message": "アイテム削除成功"}

@app.patch(
    "/items/{item_id}",
    summary="アイテムの更新",
    description="指定したitem_idのアイテムの値を更新する"
)
def update_item(item_id: int, item_data: ItemUpdate, session: Session = Depends(get_session)):
    item = session.get(Item, item_id)
    print("item: ", item)

    if item is None:
        raise HTTPException(status_code=404, detail="Item not found")

    update_data = item_data.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(item, key, value)

    session.commit()
    session.refresh(item)

    return item