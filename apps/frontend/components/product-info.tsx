"use client"

import { Button } from "@/components/ui/button";
import { useState, useMemo } from "react";
import { AddToCartDrawer } from "@/components/add-to-cart-drawer";
import { clsx } from "clsx";
import { useCartStore } from "@/stores/useCartStore";
import type { ApiProduct } from "@/types/product";

interface ProductInfoProps {
    product: ApiProduct;
}

export function ProductInfo({ product }: ProductInfoProps) {
    const { addItem } = useCartStore();

    const sizeOption = product.options.find(o => o.name === 'Size' || o.name === 'Sizes');
    const sizes = sizeOption?.values || [];
    
    const colorOption = product.options.find(o => o.name === 'Color' || o.name === 'Colors');
    const colors = colorOption?.values || [];

    const [selectedSize, setSelectedSize] = useState(sizes[0]?.value || "");
    const [selectedColor, setSelectedColor] = useState(colors[0]?.value || "");
    const [selectedQuantity, setSelectedQuantity] = useState(1);

    const selectedVariant = useMemo(() => {
        return product.variants.find(v => {
            const hasSize = sizes.length === 0 || v.optionValues.some(ov => ov.optionValue.value === selectedSize);
            const hasColor = colors.length === 0 || v.optionValues.some(ov => ov.optionValue.value === selectedColor);
            return hasSize && hasColor;
        });
    }, [product.variants, sizes.length, colors.length, selectedSize, selectedColor]);

    const price = selectedVariant?.price || "0.00";
    const sku = selectedVariant?.sku || "";

    const handleAddToCart = () => {
        addItem({
            id: selectedVariant ? selectedVariant.id.toString() : product.id.toString(),
            sku: sku,
            name: product.name,
            price: parseFloat(price),
            image: product.images[0]?.imageUrl || "",
            quantity: selectedQuantity,
            size: selectedSize,
            color: selectedColor
        })
    }

    const getColorClass = (colorName: string) => {
        const name = colorName.toLowerCase();
        if (name === 'burgundy') return 'bg-red-900';
        if (name === 'black') return 'bg-black';
        if (name === 'white') return 'bg-white';
        if (name === 'red') return 'bg-red-700';
        return 'bg-gray-500'; // fallback
    };

    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-gray-500 text-sm">SKU: {sku}</p>
            <p className="text-xl font-semibold">LE {price}</p>

            {sizes.length > 0 && (
                <div>
                    <p className="font-semibold mb-2">Size: {selectedSize}</p>
                    <div className="flex flex-wrap gap-2">
                        {sizes.map((size) => (
                            <Button 
                                key={size.id}
                                variant="outline"
                                className={clsx("rounded-full", selectedSize === size.value && "border-black")}
                                onClick={() => setSelectedSize(size.value)}>
                                {size.value}
                            </Button>
                        ))}
                    </div>
                </div>
            )}

            {colors.length > 0 && (
                <div>
                    <p className="font-semibold mb-2">Color: {selectedColor}</p>
                    <div className="flex flex-wrap gap-2">
                        {colors.map((color) => (
                            <button
                                key={color.id}
                                className={clsx(
                                    "w-8 h-8 rounded-full border-2 border-gray-200",
                                    getColorClass(color.value),
                                    selectedColor === color.value && "ring-2 ring-black"
                                )}
                                onClick={() => setSelectedColor(color.value)}>
                            </button>
                        ))}
                    </div>
                </div>
            )}

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
                    productImage={product.images[0]?.imageUrl || ""}
                    productTitle={product.name}
                    productPrice={`LE ${price}`}
                    variantText={`${selectedColor} ${selectedColor && selectedSize ? '/' : ''} ${selectedSize}`.trim()}
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
