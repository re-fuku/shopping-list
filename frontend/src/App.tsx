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
    id: string
    name: string
    is_checked: number
    is_purchased: number
    purchased_date: string    
}

export default function App() {
    const [items, setItems] = useState<ShoppingItem[]>([])
    const [selectedDay, setSelectedDay] = useState<string>("")
    const [searchItem, setSearchItem] = useState<string>("")

    const addItem = (item: ShoppingItem) => {
        setItems((prevItems) => [...prevItems, item])
    }
    
    const updateItem = (id: string, key: keyof ShoppingItem, value: any) => {
        setItems((prevItems) => 
            prevItems.map((prevItem) => 
                (prevItem.id === id ? {...prevItem, [key]: value}: prevItem)
            )
        )
    }

    const deleteItem = (id: string) => {
        setItems((prevItems) => prevItems.filter((item) => item.id !== id))
    }

    return (
        <Card className="max-w-md">
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
                            items={items.filter((item) => item.is_purchased === 0)}
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
                            items={items.filter((item) => item.is_purchased === 1 && item.name.includes(searchItem))}
                            mode="single"
                            onSelect={(date) => date?setSelectedDay(format(date, "yyyy-MM-dd")): ""}
                        />

                        {selectedDay && (
                            <ShoppingDayList
                                items={items.filter((item) => item.is_purchased === 1 && item.purchased_date === selectedDay)}
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
    )
}