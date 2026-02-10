"use client"

import { SlidersHorizontal } from "lucide-react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

export const ProductsSidebar = () => {
    return (
        <div className="p-4 rounded-lg">
            <p className="mb-4 flex items-center">
                <SlidersHorizontal className="inline-block w-4 h-4 me-2" />
                Filters
            </p>
            {/* Filter content goes here */}
            <Accordion
                type="single"
                collapsible
                className="w-full"
                defaultValue="item-1"
            >
                <AccordionItem value="item-1">
                    <AccordionTrigger className="font-bold">Price</AccordionTrigger>
                    <AccordionContent className="">
                        {/* Price Input Fields */}
                        <div className="flex gap-4 items-center">
                            <div className="flex-1">
                                <div className="flex items-center border border-border rounded-md px-3 py-2">
                                    <span className="inline-block text-sm text-muted-foreground me-1 text-nowrap">E.£</span>
                                    <input
                                        type="number"
                                        defaultValue="0"
                                        className="w-full bg-transparent outline-none text-sm"
                                        placeholder="0"
                                    />
                                </div>
                            </div>
                            <span className="text-muted-foreground">to</span>
                            <div className="flex-1">
                                <div className="flex items-center border border-border rounded-md px-3 py-2">
                                    <span className="text-sm text-muted-foreground me-1  text-nowrap">E.£</span>
                                    <input
                                        type="number"
                                        defaultValue="605"
                                        className="w-full bg-transparent outline-none text-sm"
                                        placeholder="605"
                                    />
                                </div>
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                    <AccordionTrigger>Product Types</AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-4 text-balance">
                        {/* product types list of checkboxes */}
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="t-shirt"
                                className="me-2"
                            />
                            <label htmlFor="t-shirt" className="text-sm">T-Shirts</label>
                        </div>
                        <div className="flex items-center">
                            <input type="checkbox" id="hoodies" className="me-2" />
                            <label htmlFor="hoodies" className="text-sm">Hoodies</label>
                        </div>
                        <div className="flex items-center">
                            <input type="checkbox" id="accessories" className="me-2" />
                            <label htmlFor="accessories" className="text-sm">Accessories</label>
                        </div>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                    <AccordionTrigger>Sizes</AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-4 text-balance">
                        {/* sizes list of checkboxes */}
                        <div className="flex items-center">
                            <input type="checkbox" id="small" className="me-2" />
                            <label htmlFor="small" className="text-sm">Small</label>
                        </div>
                        <div className="flex items-center">
                            <input type="checkbox" id="medium" className="me-2" />
                            <label htmlFor="medium" className="text-sm">Medium</label>
                        </div>
                        <div className="flex items-center">
                            <input type="checkbox" id="large" className="me-2" />
                            <label htmlFor="large" className="text-sm">Large</label>
                        </div>
                        <div className="flex items-center">
                            <input type="checkbox" id="x-large" className="me-2" />
                            <label htmlFor="x-large" className="text-sm">X-Large</label>
                        </div>
                    </AccordionContent>
                </AccordionItem>

            </Accordion>
        </div>
    );
};
