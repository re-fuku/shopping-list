'use client'

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { ja } from "date-fns/locale"
import type { ShoppingItem } from "@/App"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover" 
import { Sheet, SheetContent, SheetHeader, SheetTitle} from "@/components/ui/sheet"
import { TrashIcon, CalendarDays as CalendarIcon } from "lucide-react"


type ShoppingDayListProps = {
    items: ShoppingItem[]
    selectedDay: string
    setSelectedDay: (day: string) => void
    updateItem: (id: string, key: keyof ShoppingItem, value: any) => void
    deleteItem: (id: string) => void
}

type ItemRowProps = {
    item: ShoppingItem
    updateItem: (id: string, key: keyof ShoppingItem, value: any) => void
    deleteItem: (id: string) => void
}

type PopoverCalendarProps = {
    item: ShoppingItem
    updateItem: (id: string, key: keyof ShoppingItem, value: any) => void
    setIsMoving: (moving: boolean) => void
}

const SHOPPING_API = ""


function PopoverCalendar({item, updateItem, setIsMoving}: PopoverCalendarProps) {
    const [open, setOpen] = useState<boolean>(false)
    const purchased_date = item.purchased_date
    const id = item.id

    const handleUpdateItem = async (date: Date) => {

        setOpen(false)
        setIsMoving(true)

        try {
            const [res] = await Promise.all([
                fetch(SHOPPING_API,{
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({id, purchased_date: format(date, "yyyy-MM-dd") })
                }),
                new Promise((resolve) => setTimeout(resolve, 500))
            ])

            if(!res.ok){
                setIsMoving(false)
                alert("購入日付更新に失敗")
            } else {
                updateItem(id, "purchased_date", format(date,"yyyy-MM-dd"))
            }
        } catch(e) {
            setIsMoving(false)
            console.error("API呼び出し失敗")
        }


    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger className="flex gap-2 items-center">
                <span>{purchased_date}</span>
                <CalendarIcon/>
            </PopoverTrigger>

            <PopoverContent>
                <Calendar
                    mode="single"
                    onSelect={(date) => {date?handleUpdateItem(date):""}}
                    locale={ja}
                />
            </PopoverContent>
        </Popover>
    )
}


function ItemRow({item, updateItem, deleteItem}: ItemRowProps) {
    const [isMoving, setIsMoving] = useState<boolean>(false)

    const handleDeleteItem = async (id: string) => {

        setIsMoving(true)
        try {
            const [res] = await Promise.all([
                fetch(SHOPPING_API, {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json"},
                    body: JSON.stringify({id})
                }),
                new Promise((resolve) => setTimeout(resolve,500))
            ])

            if(!res.ok) {
                setIsMoving(false)
                alert("削除に失敗")
            } else {
                deleteItem(id)  
            }
        } catch (e) {
            setIsMoving(false)
            console.error("API呼び出し失敗")
        }
    }

    return (
        <div className={cn(
            "col-span-3 grid grid-cols-subgrid items-center border-b",
            "transition-all duration-500 ease-in-out",
            isMoving && "translate-x-full opacity-0"
        )}>
            <p>{item.name}</p>
            <PopoverCalendar
                item={item}
                updateItem={updateItem}
                setIsMoving={setIsMoving}
            />
            <Button
                onClick={() => handleDeleteItem(item.id)}
                disabled={isMoving}    
            >
                <TrashIcon/>
            </Button>
        </div>
    )
}


export default function ShoppingDayList({ items, selectedDay, setSelectedDay, updateItem, deleteItem }: ShoppingDayListProps) {
    const [sheetOpen, setSheetOpen] = useState<boolean>(false)

    const handleOpenChange = (open: boolean) => {
        setSheetOpen(open)
        setSelectedDay("")
    }

    useEffect(() => {
        setSheetOpen(!sheetOpen)
    },[selectedDay])
    return (
        <Sheet open={sheetOpen} onOpenChange={(open) => handleOpenChange(open)}>
            <SheetContent side={"right"}>
                <SheetHeader>
                    <SheetTitle>{selectedDay}</SheetTitle>
                </SheetHeader>

                <div className="grid grid-cols-[auto_1fr_auto] gap-x-3 gap-y-1 m-3">
                    {items.map((item) => (
                        <ItemRow
                            key={item.id}
                            item={item}
                            updateItem={updateItem}
                            deleteItem={deleteItem}
                        />
                    ))}
                </div>
            </SheetContent>
        </Sheet>
    )
}