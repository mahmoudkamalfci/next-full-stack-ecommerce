import * as React from "react"
import { LockKeyhole, X, Plus, Minus } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import Image from "next/image"
import Link from "next/link"
import { Textarea } from "./ui/textarea"
import { Label } from "./ui/label"
import { useCartStore } from "@/stores/useCartStore"

export interface AddToCartDrawerProps {
    children: React.ReactNode
}

export function AddToCartDrawer({
    children
}: AddToCartDrawerProps) {
    const [showOrderNote, setShowOrderNote] = React.useState(false)

    // Get store state
    const rawCartItems = useCartStore((state) => state.items)
    const cartItems = Array.isArray(rawCartItems) ? rawCartItems : []
    const removeItem = useCartStore((state) => state.removeItem)
    const updateQuantity = useCartStore((state) => state.updateQuantity)

    // Calculate total
    const subtotal = cartItems.reduce((acc, item) => acc + ((item?.price || 0) * (item?.quantity || 1)), 0)
    const totalItems = cartItems.reduce((acc, item) => acc + (item?.quantity || 1), 0)

    return (
        <Drawer direction="right">
            <DrawerTrigger asChild>
                {children}
            </DrawerTrigger>
            <DrawerContent>
                <div className="mx-auto w-full flex flex-col h-full">
                    <DrawerHeader className="flex flex-row justify-between items-center border-b pb-4">
                        <div className="flex items-center gap-2">
                            <DrawerTitle className="text-xl font-bold">Cart</DrawerTitle>
                            <div className="bg-black text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">{totalItems}</div>
                        </div>
                        <DrawerClose asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full p-0">
                                <X className="h-4 w-4" />
                                <span className="sr-only">Close</span>
                            </Button>
                        </DrawerClose>
                    </DrawerHeader>
                    <div className="p-4 pb-0 flex-1 overflow-y-auto">
                        {cartItems.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-gray-500 py-10">
                                <p>Your cart is currently empty.</p>
                                <DrawerClose asChild>
                                    <Button variant="outline" className="mt-4 rounded-full">Continue Shopping</Button>
                                </DrawerClose>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-6">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="flex items-start gap-4">
                                        <div className="relative w-20 h-24 bg-gray-100 rounded-md overflow-hidden shrink-0">
                                            {item.image ? (
                                                <Image
                                                    src={item.image}
                                                    alt={item.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-300">No Image</div>
                                            )}
                                        </div>
                                        <div className="flex-1 flex flex-col gap-1">
                                            <div className="flex justify-between items-start gap-2">
                                                <h4 className="font-medium text-sm line-clamp-2">{item.name}</h4>
                                                <p className="text-sm font-semibold whitespace-nowrap">LE {item.price.toFixed(2)}</p>
                                            </div>
                                            {(item.color || item.size) && (
                                                <p className="text-xs text-gray-500">
                                                    {item.color} {item.color && item.size ? "/" : ""} {item.size}
                                                </p>
                                            )}

                                            <div className="flex items-center justify-between mt-2">
                                                <div className="flex items-center border rounded-md h-8">
                                                    <button
                                                        className="px-2 text-gray-500 hover:text-black transition-colors"
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        <Minus className="w-3 h-3" />
                                                    </button>
                                                    <span className="text-xs font-medium w-6 text-center">{item.quantity}</span>
                                                    <button
                                                        className="px-2 text-gray-500 hover:text-black transition-colors"
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    >
                                                        <Plus className="w-3 h-3" />
                                                    </button>
                                                </div>
                                                <button
                                                    onClick={() => removeItem(item.id)}
                                                    className="text-xs text-gray-500 underline decoration-gray-300 hover:text-red-500 transition-colors"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <DrawerFooter className="border-t bg-gray-50/50">
                        {/* order notes form  */}
                        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${showOrderNote ? "max-h-60 opacity-100" : "max-h-0 opacity-0"}`}>
                            <form className="mb-4 pt-2">
                                <div className="space-y-4">
                                    <Label htmlFor="order-note" className="text-sm font-bold">Order note</Label>
                                    <Textarea id="order-note" placeholder="Special instructions for seller..." className="min-h-[80px] text-sm resize-none" />
                                </div>
                                <div className="mt-3">
                                    <Button type="button" onClick={() => setShowOrderNote(false)} variant="outline" className="w-full rounded-full h-10 text-sm">Save Note</Button>
                                </div>
                            </form>
                        </div>

                        {cartItems.length > 0 && (
                            <>
                                <div className="space-y-4 pt-2">
                                    <div className="flex justify-between items-center font-bold text-lg">
                                        <span>Subtotal</span>
                                        <span>LE {subtotal.toFixed(2)}</span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <p className="text-xs text-gray-500">Tax included. Shipping calculated at checkout.</p>
                                        <button
                                            type="button"
                                            onClick={() => setShowOrderNote(!showOrderNote)}
                                            className="text-xs font-medium text-gray-600 hover:text-black underline transition-colors whitespace-nowrap"
                                        >
                                            {showOrderNote ? "Hide note" : "Add order note"}
                                        </button>
                                    </div>
                                </div>
                                <div className="flex gap-3 w-full mt-4">
                                    <DrawerClose asChild>
                                        <Button variant="outline" className="flex-1 rounded-full h-12" asChild>
                                            <Link href="/cart">View Cart</Link>
                                        </Button>
                                    </DrawerClose>
                                    <Button variant="default" className="flex-1 flex items-center justify-center gap-2 rounded-full h-12 bg-[#1c1c1c] hover:bg-black" asChild>
                                        <Link href="/checkout">
                                            <LockKeyhole className="h-4 w-4" />
                                            Checkout
                                        </Link>
                                    </Button>
                                </div>
                            </>
                        )}
                    </DrawerFooter>
                </div>
            </DrawerContent>
        </Drawer>
    )
}
