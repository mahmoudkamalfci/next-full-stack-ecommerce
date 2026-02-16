"use client"

import * as React from "react"
import { LockKeyhole, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription, // Keep unused import if it was there, or remove it. It was there.
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import Image from "next/image"
import Link from "next/link"
import { Textarea } from "./ui/textarea"
import { Label } from "./ui/label"

export interface AddToCartDrawerProps {
    children: React.ReactNode
    productImage: string
    productTitle: string
    productPrice: string
    variantText: string
}

export function AddToCartDrawer({
    children,
    productImage,
    productTitle,
    productPrice,
    variantText
}: AddToCartDrawerProps) {
    const [showOrderNote, setShowOrderNote] = React.useState(false)

    return (
        <Drawer direction="right">
            <DrawerTrigger asChild>
                {children}
            </DrawerTrigger>
            <DrawerContent>
                <div className="mx-auto w-full flex flex-col h-full">
                    <DrawerHeader className="flex flex-row justify-between items-center pb-0">
                        <div className="flex items-center gap-2">
                            <DrawerTitle className="text-xl font-bold">Cart</DrawerTitle>
                            <div className="bg-black text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">1</div>
                        </div>
                        <DrawerClose asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full p-0">
                                <X className="h-4 w-4" />
                                <span className="sr-only">Close</span>
                            </Button>
                        </DrawerClose>
                    </DrawerHeader>
                    <div className="p-4 pb-0">
                        <div className="flex items-start gap-4 py-4">
                            <div className="relative w-20 h-24 bg-gray-100 rounded-md overflow-hidden shrink-0">
                                <Image
                                    src={productImage}
                                    alt={productTitle}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="flex-1 space-y-1">
                                <div className="flex justify-between">
                                    <h4 className="font-medium text-sm">{productTitle}</h4>
                                    <div className="border hover:bg-gray-50 rounded px-2 text-xs h-fit cursor-pointer">1</div>
                                </div>
                                <p className="text-sm">{productPrice}</p>
                                <p className="text-xs text-gray-500">{variantText}</p>
                                <button className="text-xs text-gray-500 underline decoration-gray-300">Remove</button>
                            </div>
                        </div>

                    </div>
                    <DrawerFooter>
                        {/* order notes form  */}
                        <div className={`grid transition-[grid-template-rows] duration-300 ease-out ${showOrderNote ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${showOrderNote ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
                                <form className="mb-4">
                                    <div className="space-y-4">
                                        <Label htmlFor="order-note" className="text-xl font-bold">Order note</Label>
                                        <Textarea id="order-note" placeholder="Order note" className="min-h-[100px]" />
                                    </div>
                                    <div className="space-y-2 mt-4">
                                        <Button type="button" onClick={() => setShowOrderNote(false)} className="rounded-full h-12 px-6">Save</Button>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div className="border-t pt-4 mt-4 space-y-4">
                            <div className="flex justify-between items-center font-bold text-lg">
                                <span>Total</span>
                                <span>{productPrice}</span>
                            </div>

                            <p className="text-xs text-gray-500">Tax included and shipping calculated at checkout</p>
                            <button
                                type="button"
                                onClick={() => setShowOrderNote(!showOrderNote)}
                                className="text-xs underline decoration-gray-400 font-medium"
                            >
                                {showOrderNote ? "Hide order note" : "Add order note"}
                            </button>

                        </div>
                        <div className="flex gap-4 w-full">
                            <Button variant="secondary" className="flex-1 rounded-full h-12" asChild>
                                <Link href="/cart">View cart</Link>
                            </Button>
                            <Button variant="default" className="flex-1 flex items-center justify-center gap-2 rounded-full h-12" asChild>
                                <Link href="/checkout">
                                    <LockKeyhole className="h-4 w-4" />
                                    Checkout
                                </Link>
                            </Button>
                        </div>
                    </DrawerFooter>
                </div>
            </DrawerContent>
        </Drawer>
    )
}
