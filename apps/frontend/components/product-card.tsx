"use client"

import { Button } from "./ui/button";
import { PlusIcon } from "lucide-react";

export interface ProductCardProps {
    name: string;
    price: string | number;
    image: string;
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
                <Button
                    variant="outline"
                    onClick={onQuickAdd}
                    className="group cursor-pointer rounded-4xl invisible absolute -bottom-0 right-4
            group-hover:visible group-hover:bottom-4
           bg-black border-black text-white hover:bg-transparent hover:text-black
           transition-all duration-300 ease-in-out"
                >
                    <PlusIcon className="me-1 h-4 w-4 " />
                    Quick Add
                </Button>
            </div>
            <div className="ps-1">
                <h3 className="text-lg font-semibold">{name}</h3>
                <p className="text-gray-600">{formattedPrice}</p>

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
