"use client"

import { ProductsSidebar } from "@/components/products-sidebar";
import ProductCard from "@/components/product-card";
import ProductSorting from "@/components/product-sorting";
import BasePagination from "@/components/pagination";
import { use } from "react";

interface CollectionPageProps {
    params: Promise<{
        slug: string;
    }>;
}

// Demo products data
const demoProducts = [
    {
        id: 1,
        name: "Classic Cotton T-Shirt",
        price: 299.99,
        image: "https://placehold.co/600x800/2D2638/white?text=Product+1",
        hoveredImage: "https://placehold.co/600x800/4B5563/white?text=Product+1+Alt",
        colors: ["#000000", "#FFFFFF", "#1E40AF"],
    },
    {
        id: 2,
        name: "Slim Fit Jeans",
        price: 599.99,
        image: "https://placehold.co/600x800/1E3A8A/white?text=Product+2",
        hoveredImage: "https://placehold.co/600x800/3B82F6/white?text=Product+2+Alt",
        colors: ["#1E3A8A", "#000000"],
    },
    {
        id: 3,
        name: "Summer Dress",
        price: 799.99,
        image: "https://placehold.co/600x800/EC4899/white?text=Product+3",
        hoveredImage: "https://placehold.co/600x800/F472B6/white?text=Product+3+Alt",
        colors: ["#EC4899", "#FBBF24", "#34D399"],
    },
    {
        id: 4,
        name: "Casual Sneakers",
        price: 899.99,
        image: "https://placehold.co/600x800/10B981/white?text=Product+4",
        hoveredImage: "https://placehold.co/600x800/34D399/white?text=Product+4+Alt",
        colors: ["#FFFFFF", "#000000", "#EF4444"],
    },
    {
        id: 5,
        name: "Leather Jacket",
        price: 1499.99,
        image: "https://placehold.co/600x800/111827/white?text=Product+5",
        hoveredImage: "https://placehold.co/600x800/374151/white?text=Product+5+Alt",
        colors: ["#000000", "#92400E"],
    },
    {
        id: 6,
        name: "Knit Sweater",
        price: 499.99,
        image: "https://placehold.co/600x800/6B7280/white?text=Product+6",
        hoveredImage: "https://placehold.co/600x800/9CA3AF/white?text=Product+6+Alt",
        colors: ["#6B7280", "#FBBF24", "#DC2626"],
    },
    {
        id: 7,
        name: "Sports Hoodie",
        price: 699.99,
        image: "https://placehold.co/600x800/8B5CF6/white?text=Product+7",
        hoveredImage: "https://placehold.co/600x800/A78BFA/white?text=Product+7+Alt",
        colors: ["#000000", "#1E40AF", "#10B981"],
    },
    {
        id: 8,
        name: "Denim Shorts",
        price: 399.99,
        image: "https://placehold.co/600x800/1E3A8A/white?text=Product+8",
        hoveredImage: "https://placehold.co/600x800/3B82F6/white?text=Product+8+Alt",
        colors: ["#1E3A8A", "#000000"],
    },
    {
        id: 9,
        name: "Formal Blazer",
        price: 1299.99,
        image: "https://placehold.co/600x800/111827/white?text=Product+9",
        hoveredImage: "https://placehold.co/600x800/1F2937/white?text=Product+9+Alt",
        colors: ["#111827", "#374151"],
    },
];

export default function CollectionPage({ params }: CollectionPageProps) {
    const { slug } = use(params);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
                {/* Sidebar */}
                <div className="w-full max-w-[300px] lg:max-w-none ">
                    <ProductsSidebar />
                </div>

                {/* Main content */}
                <div className="flex flex-col w-full">
                    <div className="mb-6 flex items-center justify-between">
                        <h1 className="text-3xl font-bold capitalize">
                            {slug?.replace('-', ' ')} Collection
                        </h1>
                        <ProductSorting />
                    </div>
                    {/* Products grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {demoProducts.map((product) => (
                            <ProductCard
                                key={product.id}
                                name={product.name}
                                price={product.price}
                                image={product.image}
                                hoveredImage={product.hoveredImage}
                                colors={product.colors}
                            />
                        ))}
                    </div>

                    <div className="mt-12 flex justify-center">

                        <BasePagination />
                    </div>
                </div>
            </div>
        </div>
    );
}
