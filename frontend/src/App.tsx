'use client'

import { useState } from "react"
import { format } from "date-fns"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ClipboardList, CalendarDays } from "lucide-react"
import ShoppingList from "@/components/ShoppingList"
import { ShoppingCalendar } from "@/components/ShoppingCalendar"
import ShoppingDayList from "@/components/ShoppingDayList"
import { Input } from "@/components/ui/input"

export type ShoppingItem = {
    id: number
    name: string
    is_checked: boolean
    purchased_date: Date | null
    created_at: Date
}

export default function App() {
    const [items, setItems] = useState<ShoppingItem[]>([])
    const [selectedDay, setSelectedDay] = useState<Date | null>(null)
    const [searchItem, setSearchItem] = useState<string>("")

    const addItem = (item: ShoppingItem) => {
        setItems((prevItems) => [...prevItems, item])
    }
    
    const updateItem = (id: number, key: keyof ShoppingItem, value: any) => {
        setItems((prevItems) => 
            prevItems.map((prevItem) => 
                (prevItem.id === id ? {...prevItem, [key]: value}: prevItem)
            )
        )
    }

    const deleteItem = (id: number) => {
        setItems((prevItems) => prevItems.filter((item) => item.id !== id))
    }

    return (
        <div className="w-full max-h-3/4 mt-20 flex justify-center">
            <Card className="w-120">
                <Tabs defaultValue="list">
                    <CardHeader>
                        <TabsList>
                            <TabsTrigger value="list" >
                                <ClipboardList className="mr-2 h-4 w-4" />
                            </TabsTrigger>
                            <TabsTrigger value="calendar">
                                <CalendarDays className="mr-2 h-4 w-4" />
                            </TabsTrigger>
                        </TabsList>
                    </CardHeader>

                    <CardContent className="relative">
                        <TabsContent value="list" className="max-w-md">
                            <ShoppingList
                                items={items.filter((item) => item.purchased_date === null)}
                                setItems={setItems}
                                addItem={addItem}
                                updateItem={updateItem}
                                deleteItem={deleteItem}
                            />
                        </TabsContent>

                        <TabsContent value="calendar">
                            <Input
                                className="w-30 absolute -top-10 right-5"
                                placeholder="🔍検索"
                                value={searchItem}
                                onChange={(e) => setSearchItem(e.target.value)}
                                onFocus={(e) => e.target.select()}
                            />

                            <ShoppingCalendar
                                items={items.filter((item) => item.purchased_date === null && item.name.includes(searchItem))}
                                mode="single"
                                onSelect={(date) => date?setSelectedDay(date): null}
                            />

                            {selectedDay && (
                                <ShoppingDayList
                                    items={items.filter((item) => item.is_checked === true && item.purchased_date === selectedDay)}
                                    selectedDay={selectedDay}
                                    setSelectedDay={setSelectedDay}
                                    deleteItem={deleteItem}
                                    updateItem={updateItem}
                                />
                            )}
                        </TabsContent>
                    </CardContent>
                </Tabs>
            </Card>
        </div>
        
    )
}