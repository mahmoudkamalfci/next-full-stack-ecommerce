"use client"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"

export default function ProductSorting() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger className="group">
                <span className="font-bold">Sort By: </span>
                <span className="relative">
                    Featured
                    <span
                        className="absolute left-0 -bottom-1 h-[2px] w-0 bg-primary transition-all duration-300 group-hover:w-full"
                        aria-hidden="true"
                    />
                </span>
                {isOpen ? (
                    <ChevronUp
                        className="inline-block ms-2 rounded-full bg-black text-white w-[20px] h-[20px] p-1 transition-all duration-300 ease-in-out"
                    />
                ) : (
                    <ChevronDown
                        className="inline-block ms-2 rounded-full bg-gray-200 text-black w-[20px] h-[20px] p-1 group-hover:bg-black group-hover:text-white transition-all duration-300 ease-in-out"
                    />
                )}
            </DropdownMenuTrigger>
            <DropdownMenuContent className="px-4">
                <DropdownMenuItem className="py-2 group relative">
                    Featured
                    <span
                        className="absolute left-0 -bottom-1 h-[2px] w-0 bg-primary transition-all duration-300 group-hover:w-full"
                        aria-hidden="true"
                    />
                </DropdownMenuItem>

                <DropdownMenuItem className="py-2 group relative">
                    Best selling
                    <span
                        className="absolute left-0 -bottom-1 h-[2px] w-0 bg-primary transition-all duration-300 group-hover:w-full"
                        aria-hidden="true"
                    />
                </DropdownMenuItem>

                <DropdownMenuItem className="py-2 group relative">
                    Alphabetically, A-Z
                    <span
                        className="absolute left-0 -bottom-1 h-[2px] w-0 bg-primary transition-all duration-300 group-hover:w-full"
                        aria-hidden="true"
                    />
                </DropdownMenuItem>

                <DropdownMenuItem className="py-2 group relative">
                    Alphabetically, Z-A
                    <span
                        className="absolute left-0 -bottom-1 h-[2px] w-0 bg-primary transition-all duration-300 group-hover:w-full"
                        aria-hidden="true"
                    />
                </DropdownMenuItem>

                <DropdownMenuItem className="py-2 group relative">
                    Price, low to high
                    <span
                        className="absolute left-0 -bottom-1 h-[2px] w-0 bg-primary transition-all duration-300 group-hover:w-full"
                        aria-hidden="true"
                    />
                </DropdownMenuItem>

                <DropdownMenuItem className="py-2 group relative">
                    Price, high to low
                    <span
                        className="absolute left-0 -bottom-1 h-[2px] w-0 bg-primary transition-all duration-300 group-hover:w-full"
                        aria-hidden="true"
                    />
                </DropdownMenuItem>

                <DropdownMenuItem className="py-2 group relative">
                    Date, old to new
                    <span
                        className="absolute left-0 -bottom-1 h-[2px] w-0 bg-primary transition-all duration-300 group-hover:w-full"
                        aria-hidden="true"
                    />
                </DropdownMenuItem>

                <DropdownMenuItem className="py-2 group relative">
                    Date, new to old
                    <span
                        className="absolute left-0 -bottom-1 h-[2px] w-0 bg-primary transition-all duration-300 group-hover:w-full"
                        aria-hidden="true"
                    />
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
