"use client"

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    type CarouselApi,

} from "@/components/ui/carousel"
import ProductCard from "./product-card";
import SectionTitle from "@/components/section-title";
import { useEffect, useState } from "react";

// Women's sports apparel products
const sampleProducts = [
    { id: 1, name: "Athletic Sports Bra", price: 450.00, image: "https://placehold.co/600x800/FF6B9D/white?text=Sports+Bra", colors: ["#FF6B9D", "#000000"] },
    { id: 2, name: "Performance Leggings", price: 650.00, image: "https://placehold.co/600x800/8B4789/white?text=Leggings", colors: ["#8B4789", "#1E3A8A"] },
    { id: 3, name: "Training Tank Top", price: 350.00, image: "https://placehold.co/600x800/4ECDC4/white?text=Tank+Top", colors: ["#4ECDC4", "#FFFFFF"] },
    { id: 4, name: "Running Shorts", price: 400.00, image: "https://placehold.co/600x800/FF6F61/white?text=Running+Shorts", colors: ["#FF6F61", "#000000"] },
    { id: 5, name: "Yoga Crop Top", price: 380.00, image: "https://placehold.co/600x800/95E1D3/white?text=Crop+Top", colors: ["#95E1D3", "#F38181"] },
    { id: 6, name: "High-Waist Gym Shorts", price: 420.00, image: "https://placehold.co/600x800/AA96DA/white?text=Gym+Shorts", colors: ["#AA96DA", "#2D2638"] },
    { id: 7, name: "Mesh Training Tee", price: 320.00, image: "https://placehold.co/600x800/FCBAD3/white?text=Training+Tee", colors: ["#FCBAD3", "#4B5563"] },
    { id: 8, name: "Compression Capris", price: 580.00, image: "https://placehold.co/600x800/A8D8EA/white?text=Capris", colors: ["#A8D8EA", "#10B981"] },
];

const WomenCollection = () => {
    const [api, setApi] = useState<CarouselApi>()
    const [current, setCurrent] = useState(0)
    const [count, setCount] = useState(0)

    useEffect(() => {
        if (!api) {
            return
        }

        setCount(api.scrollSnapList().length)
        setCurrent(api.selectedScrollSnap() + 1)

        api.on("select", () => {
            setCurrent(api.selectedScrollSnap() + 1)
        })
    }, [api])

    const handleQuickAdd = (productId: number) => {
        // Handle add to cart logic here
        // You can implement the actual logic like: addToCart(productId)
        void productId; // Acknowledge the parameter
    };

    return (
        <section className="py-8">
            <div className="container mx-auto">
                <SectionTitle title="Women's Collection" />

                <Carousel
                    setApi={setApi}
                    opts={{
                        align: "start",
                        // loop: true,
                    }}

                >
                    <CarouselContent className="-ml-4">
                        {sampleProducts.map((product) => (
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
                    <div className="flex justify-between items-center gap-8  mt-12">
                        {/* Progress Bar */}
                        <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gray-900 transition-all duration-300 ease-out"
                                style={{ width: `${((current / count) * 100)}%` }}
                            />
                        </div>
                        <div className="flex justify-end items-center gap-4">

                            <CarouselPrevious className="static translate-y-0 w-10 h-10" />
                            <CarouselNext className="static translate-y-0 w-10 h-10" />
                        </div>
                    </div>
                </Carousel>

            </div>
        </section>
    );
}

export default WomenCollection;
