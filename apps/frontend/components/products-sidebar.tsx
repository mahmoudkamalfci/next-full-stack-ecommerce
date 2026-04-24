"use client";

import { useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import type { CategoryFilters } from "@/types";

interface ProductsSidebarProps {
    filters: CategoryFilters;
}

export const ProductsSidebar = ({ filters }: ProductsSidebarProps) => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const activeSizes  = searchParams.getAll("sizes");
    const activeColors = searchParams.getAll("colors");
    const activeTypes  = searchParams.getAll("types");

    const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") ?? "");
    const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") ?? "");

    function toggleParam(key: string, value: string, current: string[]) {
        const params = new URLSearchParams(searchParams.toString());
        params.delete(key);
        const next = current.includes(value)
            ? current.filter(v => v !== value)
            : [...current, value];
        next.forEach(v => params.append(key, v));
        params.set("page", "1");
        router.push(`${pathname}?${params.toString()}`);
    }

    function applyPrice() {
        const params = new URLSearchParams(searchParams.toString());
        if (minPrice) params.set("minPrice", minPrice); else params.delete("minPrice");
        if (maxPrice) params.set("maxPrice", maxPrice); else params.delete("maxPrice");
        params.set("page", "1");
        router.push(`${pathname}?${params.toString()}`);
    }

    return (
        <div className="p-4 rounded-lg">
            <p className="mb-4 flex items-center">
                <SlidersHorizontal className="inline-block w-4 h-4 me-2" />
                Filters
            </p>
            <Accordion type="multiple" className="w-full">

                {/* Price */}
                <AccordionItem value="price">
                    <AccordionTrigger className="font-bold">Price</AccordionTrigger>
                    <AccordionContent>
                        <div className="flex gap-4 items-center">
                            <div className="flex-1">
                                <div className="flex items-center border border-border rounded-md px-3 py-2">
                                    <span className="inline-block text-sm text-muted-foreground me-1 text-nowrap">E.£</span>
                                    <input
                                        type="number"
                                        value={minPrice}
                                        onChange={e => setMinPrice(e.target.value)}
                                        onBlur={applyPrice}
                                        className="w-full bg-transparent outline-none text-sm"
                                        placeholder="0"
                                    />
                                </div>
                            </div>
                            <span className="text-muted-foreground">to</span>
                            <div className="flex-1">
                                <div className="flex items-center border border-border rounded-md px-3 py-2">
                                    <span className="text-sm text-muted-foreground me-1 text-nowrap">E.£</span>
                                    <input
                                        type="number"
                                        value={maxPrice}
                                        onChange={e => setMaxPrice(e.target.value)}
                                        onBlur={applyPrice}
                                        className="w-full bg-transparent outline-none text-sm"
                                        placeholder="9999"
                                    />
                                </div>
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* Product Types */}
                <AccordionItem value="types">
                    <AccordionTrigger>Product Types</AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-4">
                        {filters.productTypes.map((type) => (
                            <div key={type} className="flex items-center">
                                <input
                                    type="checkbox"
                                    id={`type-${type}`}
                                    className="me-2"
                                    checked={activeTypes.includes(type)}
                                    onChange={() => toggleParam("types", type, activeTypes)}
                                />
                                <label htmlFor={`type-${type}`} className="text-sm">{type}</label>
                            </div>
                        ))}
                    </AccordionContent>
                </AccordionItem>

                {/* Sizes */}
                <AccordionItem value="sizes">
                    <AccordionTrigger>Sizes</AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-4">
                        {filters.sizes.map((size) => (
                            <div key={size} className="flex items-center">
                                <input
                                    type="checkbox"
                                    id={`size-${size}`}
                                    className="me-2"
                                    checked={activeSizes.includes(size)}
                                    onChange={() => toggleParam("sizes", size, activeSizes)}
                                />
                                <label htmlFor={`size-${size}`} className="text-sm">{size}</label>
                            </div>
                        ))}
                    </AccordionContent>
                </AccordionItem>

                {/* Colors */}
                <AccordionItem value="colors">
                    <AccordionTrigger>Colors</AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-4">
                        {filters.colors.map((color) => (
                            <div key={color} className="flex items-center">
                                <input
                                    type="checkbox"
                                    id={`color-${color}`}
                                    className="me-2"
                                    checked={activeColors.includes(color)}
                                    onChange={() => toggleParam("colors", color, activeColors)}
                                />
                                <label htmlFor={`color-${color}`} className="text-sm">{color}</label>
                            </div>
                        ))}
                    </AccordionContent>
                </AccordionItem>

            </Accordion>
        </div>
    );
};
