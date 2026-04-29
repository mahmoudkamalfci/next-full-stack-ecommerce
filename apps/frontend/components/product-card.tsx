"use client"

import { Button } from "./ui/button";
import { PlusIcon } from "lucide-react";
import Link from "next/link";

export interface ProductCardProps {
    name: string;
    price: string | number;
    image: string;
    href: string;
    hoveredImage?: string;
    colors?: string[];
    onQuickAdd?: () => void;
    className?: string;
    maxWidth?: string | number;
}

const ProductCard = ({
    name,
    price,
    image,
    href,
    hoveredImage,
    colors = [],
    onQuickAdd,
    className = "",
    maxWidth = "100%",
}: ProductCardProps) => {
    const formattedPrice = typeof price === "number" ? `LE ${price.toFixed(2)}` : price;

    return (
        <div
            className={`flex flex-col gap-4 ${className}`}
            style={{ maxWidth }}
        >
            <div className="w-full relative group">
                <Link href={href} className="block">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={image} alt={name} className="w-full rounded-md" />
                    {hoveredImage && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={hoveredImage}
                            alt={name}
                            className="w-full rounded-md absolute top-0 left-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        />
                    )}
                </Link>
                <Button
                    variant="outline"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (onQuickAdd) onQuickAdd();
                    }}
                    className="group cursor-pointer rounded-4xl invisible absolute -bottom-0 right-4
            group-hover:visible group-hover:bottom-4
           bg-black border-black text-white hover:bg-transparent hover:text-black
           transition-all duration-300 ease-in-out z-10"
                >
                    <PlusIcon className="me-1 h-4 w-4 " />
                    Quick Add
                </Button>
            </div>
            <div className="ps-1">
                <Link href={href} className="block">
                    <h3 className="text-lg font-semibold">{name}</h3>
                    <p className="text-gray-600">{formattedPrice}</p>
                </Link>

                {colors.length > 0 && (
                    <div className="mt-4">
                        <div className="flex gap-2">
                            {colors.map((color, index) => (
                                <button
                                    key={color}
                                    className={`w-6 h-6 rounded-full ${index === 0 ? "ring-2 ring-black ring-offset-2" : ""
                                        }`}
                                    style={{ backgroundColor: color }}
                                    aria-label={`Select color ${color}`}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductCard;
