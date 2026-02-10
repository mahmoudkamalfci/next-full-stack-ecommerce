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

// Sample product data - replace with actual data from API/props
const sampleProducts = [
    { id: 1, name: "FlexCut Shorts", price: 690.00, image: "https://placehold.co/600x800/2D2638/white?text=FlexCut+Shorts", colors: ["#2D2638", "#1E3A8A"] },
    { id: 2, name: "Power Leggings", price: 850.00, image: "https://placehold.co/600x800/000000/white?text=Power+Leggings", colors: ["#000000", "#4B5563"] },
    { id: 3, name: "Active Top", price: 550.00, image: "https://placehold.co/600x800/FFFFFF/333333?text=Active+Top", colors: ["#FFFFFF", "#EF4444"] },
    { id: 4, name: "Sport Jacket", price: 1200.00, image: "https://placehold.co/600x800/1E3A8A/white?text=Sport+Jacket", colors: ["#1E3A8A", "#10B981"] },
    { id: 5, name: "Training Shoes", price: 1500.00, image: "https://placehold.co/600x800/111827/white?text=Training+Shoes", colors: ["#000000", "#FFFFFF"] },
    { id: 6, name: "Yoga Mat", price: 350.00, image: "https://placehold.co/600x800/8B5CF6/white?text=Yoga+Mat", colors: ["#8B5CF6", "#EC4899"] },
    { id: 7, name: "Gym Bag", price: 450.00, image: "https://placehold.co/600x800/374151/white?text=Gym+Bag", colors: ["#000000", "#2D2638"] },
    { id: 8, name: "Water Bottle", price: 150.00, image: "https://placehold.co/600x800/3B82F6/white?text=Water+Bottle", colors: ["#3B82F6", "#10B981"] },
];

const NewCollections = () => {
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
                <SectionTitle title="Shop by Category" />

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

export default NewCollections;
