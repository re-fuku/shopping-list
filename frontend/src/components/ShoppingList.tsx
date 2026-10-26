'use client'

import { useState, useEffect, type FormEvent } from "react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { TrashIcon } from "lucide-react"
import type { ShoppingItem } from "@/App"


type ShoppingItemListProps = {
    items: ShoppingItem[]
    setItems: (items: ShoppingItem[]) => void
    addItem: (item: ShoppingItem) => void
    updateItem: (id: string, key: keyof ShoppingItem, value: any) => void
    deleteItem: (id: string) => void
}

type ShoppingItemRowProps = {
    item: ShoppingItem
    isEditingID: string
    setIsEditingID: (isEditingID: string) => void
    onToggle: (id: string) => void
    onRename: (id: string, newName: string) => void 
    onDelete: (id: string) => Promise<boolean>
}


function ShoppingItemRow({ item, isEditingID, setIsEditingID, onToggle, onRename, onDelete }: ShoppingItemRowProps) {
    const [draftName, setDraftName] = useState(item.name)
    const [isMoving, setIsMoving] = useState<boolean>(false)

    const commitEdit = () => {
        const name = draftName.trim()
        if (name && name !== item.name) {
            onRename(item.id, name)
        } else {
            setDraftName(item.name)
        }

        setIsEditingID("")
    }

    const handleDelete = async () => {
        setIsMoving(true)

        const succeeded = await onDelete(item.id)

        if(!succeeded) setIsMoving(false)
    }

    return (
        <div className={cn(
                "col-span-3 grid grid-cols-subgrid items-center",
                "transition-all duration-500 ease-in-out",
                isMoving && "translate-x-full opacity-0" 
            )}
        >
            <Checkbox
                checked={item.is_checked === 1}
                onCheckedChange={() => onToggle(item.id)}
            />
            
            {isEditingID === item.id ? (
                <Input
                    value={draftName}
                    onChange={(e) => setDraftName(e.target.value)}
                    onBlur={commitEdit}
                    autoFocus
                    onKeyDown={(e) => e.key === "Enter" && commitEdit()}
                />
            ) : (
                <span onClick={() => setIsEditingID(item.id)}>{item.name}</span>
            )}

            <Button onClick={handleDelete} disabled={isMoving}>
                <TrashIcon/>
            </Button>
        </div>
    )
}

export default function ShoppingList({ items, setItems, addItem, updateItem, deleteItem }: ShoppingItemListProps) {
    const [newItemName, setNewItemName] = useState<string>("")
    const [isEditingID, setIsEditingID] = useState<string>("")

    const unIs_checkedItems = items.filter((item) => item.is_checked === 0 && item.is_purchased === 0)
    const is_checkedItems = items.filter((item) => item.is_checked === 1 && item.is_purchased === 0)
    const SHOPPING_API = ""

    const handleAddItem = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const name = newItemName.trim()
        const id = crypto.randomUUID()
        
        if (!name) return

        const res = await fetch(SHOPPING_API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({id, name}),
        })

        if (!res.ok) {
            alert("アイテムの追加に失敗")
        } else {
            addItem({id, name, is_checked: 0, is_purchased: 0, purchased_date: ""})
        }

        setNewItemName("")
    }

    const toggleItem = async (id: string) => {
        const item = items.find((item) => item.id === id)
        const is_checked = item?.is_checked === 0 ? 1 : 0

        const res = await fetch(SHOPPING_API, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({id, is_checked}),
        })

        if (!res.ok) {
            alert("チェック状態の更新に失敗")
        } else {
            updateItem(id, "is_checked", is_checked)
        }
    }

    const handleDeleteItem = async (id: string) => {

        try {
            const [res] = await Promise.all([
                fetch(SHOPPING_API,{
                    method: "DELETE",
                    headers: { "Content-Type": "application/json"},
                    body: JSON.stringify({id})
                }),
                new Promise((resolve) => setTimeout(resolve, 500))
            ])

            if (!res.ok) {
                alert("削除に失敗")
                return false
            } else {
                deleteItem(id)
                return true
            }
        } catch (e) {
            console.error("deleteItem: API呼び出し失敗")
            return false
        }
    }

    const handleRenameItem = async (id: string, newName: string) => {
        try {
            const res = await fetch(SHOPPING_API, {
                method: "PATCH",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({id, name: newName}),
            })

            if (!res.ok) {
                alert("名前の変更に失敗")
            } else {
                updateItem(id, "name", newName)
            }

        } catch (e) {
            console.error("renameItem: API呼び出し失敗")
        }
    }

    const purchasedItem = async () => {

        try {
            const res = await fetch(`${SHOPPING_API}/purchase`,{
                method: "POST", 
            })

            if (!res.ok) {
                alert("購入済みへの登録に失敗")
            } else {
                fetchItems()
            }

        } catch (e) {
            console.error("purchasedItem: API呼び出し失敗")
        }

    }

    const fetchItems = async () => {
        const res = await fetch(`${SHOPPING_API}`)

        if(!res.ok) {
            console.error("アイテムの取得に失敗")
        }

        const data = await res.json() as ShoppingItem[]
        setItems(data)
    }

    useEffect(() => {
        fetchItems()
    },[])

    return (
        <div>
            <form onSubmit={handleAddItem} className="flex gap-2">
                <Input
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    placeholder="牛乳, 卵, パン..."
                />
                <Button type="submit">追加</Button>
            </form>

            <div className="m-4">
                <div className="grid grid-cols-[auto_1fr_auto] gap-x-3 gap-y-1">
                    {unIs_checkedItems.map((item) => (
                        <ShoppingItemRow
                            key={item.id}
                            item={item}
                            isEditingID={isEditingID}
                            setIsEditingID={setIsEditingID}
                            onToggle={toggleItem}
                            onRename={handleRenameItem}
                            onDelete={handleDeleteItem}    
                        />
                    ))}
                </div>

                <Separator className="m-2" />

                <div className="grid grid-cols-[auto_1fr_auto] gap-x-3 gap-y-1">
                    {is_checkedItems.map((item) => (
                        <ShoppingItemRow
                            key={item.id}
                            item={item}
                            isEditingID={isEditingID}
                            setIsEditingID={setIsEditingID}
                            onToggle={toggleItem}
                            onRename={handleRenameItem}
                            onDelete={handleDeleteItem}    
                        />
                    ))}
                </div>
            </div>
            
            <div className="mr-15 flex justify-end">
                <Button onClick={() => purchasedItem()}>登録</Button>
            </div>
        </div>
    )
}