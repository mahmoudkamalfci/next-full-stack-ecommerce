"use client"

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { AddToCartDrawer } from "@/components/add-to-cart-drawer";
import { clsx } from "clsx";
import { useCartStore } from "@/stores/useCartStore";

interface ProductInfoProps {
    images: string[];
}

export function ProductInfo({ images }: ProductInfoProps) {
    const { addItem } = useCartStore();
    const [selectedSize, setSelectedSize] = useState("XS/S")
    const [selectedColor, setSelectedColor] = useState("Burgundy")
    const [selectedQuantity, setSelectedQuantity] = useState(1)

    const handleAddToCart = () => {
        addItem({
            id: `core-joggers-${selectedSize}-${selectedColor}`,
            sku: `UMJR-174-2411-${selectedSize}-${selectedColor.substring(0, 3).toUpperCase()}`,
            name: "Core Joggers",
            price: 699,
            image: images[0] || "",
            quantity: selectedQuantity,
            size: selectedSize,
            color: selectedColor
        })
    }

    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold">Core Joggers</h1>
            <p className="text-gray-500 text-sm">SKU: UMJR-174-2411-{selectedSize}-{selectedColor === "Burgundy" ? "BRG" : selectedColor.substring(0, 3).toUpperCase()}</p>
            <p className="text-xl font-semibold">LE 699.00</p>

            <div>
                <p className="font-semibold mb-2">Size: {selectedSize}</p>
                <div className="flex gap-2">
                    <Button variant="outline"
                        className={clsx("rounded-full", selectedSize === "XS/S" && "border-black")}
                        onClick={() => setSelectedSize("XS/S")}>
                        XS/S
                    </Button>
                    <Button variant="outline"
                        className={clsx("rounded-full", selectedSize === "M/L" && "border-black")}
                        onClick={() => setSelectedSize("M/L")}>
                        M/L
                    </Button>
                    <Button variant="outline"
                        className={clsx("rounded-full", selectedSize === "XL/2XL" && "border-black")}
                        onClick={() => setSelectedSize("XL/2XL")}>
                        XL/2XL
                    </Button>
                </div>
            </div>

            <div>
                <p className="font-semibold mb-2">Color: {selectedColor}</p>
                <div className="flex gap-2">
                    <button
                        className={clsx("w-8 h-8 rounded-full bg-red-900 border-2 border-white ",
                            selectedColor === "Burgundy" && "ring-2 ring-black")}
                        onClick={() => setSelectedColor("Burgundy")}>
                    </button>
                    <button
                        className={clsx("w-8 h-8 rounded-full bg-black border-2 border-white ",
                            selectedColor === "Black" && "ring-2 ring-black")}
                        onClick={() => setSelectedColor("Black")}>
                    </button>
                    <button
                        className={clsx("w-8 h-8 rounded-full bg-white border-2 border-gray-200 ",
                            selectedColor === "White" && "ring-2 ring-black")}
                        onClick={() => setSelectedColor("White")}>
                    </button>
                    <button
                        className={clsx("w-8 h-8 rounded-full bg-red-700 border-2 border-white ",
                            selectedColor === "Red" && "ring-2 ring-black")}
                        onClick={() => setSelectedColor("Red")}>
                    </button>
                </div>
            </div>

            <div>
                <p className="font-semibold mb-2">Quantity:</p>
                <div className="flex items-center border rounded-md w-fit">
                    <button
                        disabled={selectedQuantity === 1}
                        className="px-3 py-1 bg-white hover:bg-gray-100"
                        onClick={() => setSelectedQuantity(selectedQuantity > 1 ? selectedQuantity - 1 : selectedQuantity)}> - </button>
                    <span className="px-3 py-1 border-x">{selectedQuantity}</span>
                    <button
                        className="px-3 py-1 bg-white hover:bg-gray-100"
                        onClick={() => setSelectedQuantity(selectedQuantity + 1)}>+</button>
                </div>
            </div>

            <div className="flex gap-4 mt-4">
                <AddToCartDrawer
                    productImage={images[0] || ""}
                    productTitle="Core Joggers"
                    productPrice="LE 699.00"
                    variantText={`${selectedColor} / ${selectedSize}`}
                >
                    <Button
                        variant="secondary"
                        className="flex-1 rounded-full py-6 w-full"
                        onClick={handleAddToCart}
                    >
                        Add to cart
                    </Button>
                </AddToCartDrawer>
                <Button variant="default" className="flex-1 rounded-full py-6">Buy it now</Button>
            </div>
        </div>
    )
}
