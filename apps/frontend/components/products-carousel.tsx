"use client"

import type { ProductItem } from "@/types/product";
import { useEffect, useState } from "react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    type CarouselApi,
} from "@/components/ui/carousel";
import ProductCard from "./product-card";

interface ProductsCarouselProps {
    products: ProductItem[];
}

const ProductsCarousel = ({ products }: ProductsCarouselProps) => {
    const [api, setApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState(0);
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!api) return;

        setCount(api.scrollSnapList().length);
        setCurrent(api.selectedScrollSnap() + 1);

        api.on("select", () => {
            setCurrent(api.selectedScrollSnap() + 1);
        });
    }, [api]);

    const handleQuickAdd = (productId: number) => {
        // TODO: dispatch add-to-cart action
        void productId;
    };

    return (
        <Carousel
            setApi={setApi}
            opts={{
                align: "start",
            }}
        >
            <CarouselContent className="-ml-4">
                {products.map((product) => (
                    <CarouselItem key={product.id} className="basis-1/4 pl-4 pb-4">
                        <ProductCard
                            name={product.name}
                            price={product.price}
                            image={product.image}
                            colors={product.colors}
                            onQuickAdd={() => handleQuickAdd(product.id)}
                        />
                    </CarouselItem>
                ))}
            </CarouselContent>
            <div className="flex justify-between items-center gap-8 mt-12">
                {/* Progress Bar */}
                <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gray-900 transition-all duration-300 ease-out"
                        style={{ width: `${(current / count) * 100}%` }}
                    />
                </div>
                <div className="flex justify-end items-center gap-4">
                    <CarouselPrevious className="static translate-y-0 w-10 h-10" />
                    <CarouselNext className="static translate-y-0 w-10 h-10" />
                </div>
            </div>
        </Carousel>
    );
};

export default ProductsCarousel;
