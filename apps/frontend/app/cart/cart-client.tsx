"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { Lock, Package } from "lucide-react"

import { useCartStore } from "@/stores/useCartStore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"

export function CartClient() {
    const [mounted, setMounted] = useState(false)
    const cartItems = useCartStore((state) => state.items)
    const removeItem = useCartStore((state) => state.removeItem)
    const addItem = useCartStore((state) => state.addItem)

    // React hook form for order notes
    const form = useForm({
        defaultValues: {
            orderNote: "",
        },
    })

    // Hydration check
    useEffect(() => {
        setMounted(true)
    }, [])

    const loadMockData = () => {
        addItem({
            id: "mock-1",
            sku: "PWR-TEE-S-DKG",
            name: "PowerLite Training Tee",
            price: 499,
            image: "",
            quantity: 2,
            size: "S",
            color: "Dark Grey"
        });
    }

    if (!mounted) {
        return null // or a loading skeleton
    }

    if (cartItems.length === 0) {
        return (
            <div className="text-center py-12 flex flex-col items-center">
                <p className="text-gray-500 mb-6">Your cart is currently empty.</p>
                <div className="flex gap-4">
                    <Button asChild className="rounded-full px-8">
                        <Link href="/">Continue Shopping</Link>
                    </Button>
                    <Button onClick={loadMockData} variant="outline" className="rounded-full px-8">
                        Load Mock Data
                    </Button>
                </div>
            </div>
        )
    }

    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0)

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-8">
            {/* Left Column */}
            <div className="lg:col-span-8">
                <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b text-sm font-bold">
                    <div className="col-span-6">Product</div>
                    <div className="col-span-3 text-center">Quantity</div>
                    <div className="col-span-3 text-right">Total</div>
                </div>

                <div className="flex flex-col gap-6 py-6">
                    {cartItems.map((item) => (
                        <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center border-b pb-6">
                            <div className="col-span-6 flex gap-4">
                                <div className="w-24 h-32 relative bg-gray-50 rounded-md overflow-hidden shrink-0">
                                    {item.image && (
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            fill
                                            className="object-cover"
                                        />
                                    )}
                                </div>
                                <div className="flex flex-col justify-center gap-1.5 pt-2">
                                    <h3 className="font-bold text-base">{item.name}</h3>
                                    <p className="text-sm text-gray-500">LE {item.price.toFixed(2)}</p>
                                    {(item.color || item.size) && (
                                        <p className="text-sm text-gray-400">
                                            {item.color} {item.color && item.size ? "/" : ""} {item.size}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="col-span-3 flex flex-col items-center gap-2 mt-4 md:mt-0">
                                <div className="border border-gray-200 rounded-md px-4 py-2 w-16 text-center text-sm font-medium">
                                    {item.quantity}
                                </div>
                                <button
                                    onClick={() => removeItem(item.id)}
                                    className="text-xs text-gray-400 hover:text-gray-700 underline underline-offset-4 transition-colors"
                                >
                                    Remove
                                </button>
                            </div>

                            <div className="col-span-3 text-right text-sm text-gray-700 mt-2 md:mt-0">
                                LE {(item.price * item.quantity).toFixed(2)}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-6 md:pr-12">
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="shipping" className="border-none">
                            <AccordionTrigger className="flex justify-between items-center px-0 py-4 hover:no-underline [&[data-state=open]>div>svg.lucide-chevron-down]:rotate-180">
                                <div className="flex items-center gap-2 font-bold text-lg text-gray-800">
                                    <Package className="w-5 h-5" />
                                    Estimate shipping
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="pt-2 pb-6 px-1">
                                <div className="flex gap-4 items-end flex-wrap">
                                    <div className="flex-1 min-w-[140px]">
                                        <Label className="text-xs text-gray-400 mb-1.5 block uppercase tracking-wider">country</Label>
                                        <Select defaultValue="egypt">
                                            <SelectTrigger className="h-11 rounded-md">
                                                <SelectValue placeholder="Select country" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="egypt">Egypt</SelectItem>
                                                <SelectItem value="usa">United States</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="flex-1 min-w-[140px]">
                                        <Label className="text-xs text-gray-400 mb-1.5 block uppercase tracking-wider">province</Label>
                                        <Select defaultValue="6th">
                                            <SelectTrigger className="h-11 rounded-md">
                                                <SelectValue placeholder="Select province" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="6th">6th of October</SelectItem>
                                                <SelectItem value="cairo">Cairo</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="flex-1 min-w-[120px]">
                                        <Label className="text-xs text-gray-400 mb-1.5 block opacity-0 uppercase tracking-wider">Zip code</Label>
                                        <Input placeholder="Zip code" className="h-11 rounded-md" />
                                    </div>
                                    <Button className="h-11 px-8 rounded-full bg-[#1c1c1c] hover:bg-black text-white font-medium shadow-none">
                                        Estimate
                                    </Button>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-4">
                <div className="border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] rounded-xl p-8 bg-white flex flex-col gap-6">
                    <div className="flex justify-between items-center text-gray-500 text-sm">
                        <span>Subtotal</span>
                        <span>LE {subtotal.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between items-center font-bold text-2xl text-gray-900">
                        <span>Total</span>
                        <span>LE {subtotal.toFixed(2)}</span>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-3 relative flex items-center justify-between mt-2">
                        <div className="absolute -right-2 -top-2 bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm transform rotate-12">15%</div>
                        <div>
                            <p className="text-xs text-gray-700">Or split it into 3 payments of <span className="font-bold text-rose-600">{(subtotal / 3).toFixed(1)}</span></p>
                            <p className="text-xs text-rose-600 font-bold mb-0.5"><span className="text-rose-600">EGP</span></p>
                            <p className="font-semibold mt-1 text-[10px] text-gray-900">No interest, No registration.</p>
                        </div>
                        <div className="bg-rose-500 text-white px-2 py-0.5 rounded font-bold text-sm italic tracking-tighter self-end h-fit">
                            s/mpl
                        </div>
                    </div>

                    <p className="text-sm text-gray-500 leading-relaxed mt-2 pr-4">
                        Tax included and shipping calculated at checkout
                    </p>

                    <div className="pt-2">
                        <Form {...form}>
                            <form className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="orderNote"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Order note"
                                                    className="resize-none h-28 text-sm bg-white"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </form>
                        </Form>
                    </div>

                    <Button className="w-full rounded-full h-14 mt-4 bg-[#1c1c1c] hover:bg-black text-white text-base font-semibold flex gap-2.5 items-center justify-center shadow-none transition-all">
                        <Lock className="w-4 h-4" />
                        Checkout
                    </Button>
                </div>
            </div>
        </div>
    )
}
