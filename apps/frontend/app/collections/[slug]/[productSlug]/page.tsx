import { ProductImageCarousel } from "@/components/product-image-carousel";
import { Button } from "@/components/ui/button";

export default function ProductPage() {
    const images = [
        "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80",
        "https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?w=800&q=80",
        "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80",
        "https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?w=800&q=80",
        "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80",
        "https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?w=800&q=80",
        "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80",
        "https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?w=800&q=80",
    ];

    return (
        <div className="container mx-auto px-4 py-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
                {/* Left Column: Image Carousel */}
                <div className="w-full">
                    <ProductImageCarousel images={images} />
                </div>

                {/* Right Column: Product Details */}
                <div className="flex flex-col gap-4">
                    <h1 className="text-3xl font-bold">Core Joggers</h1>
                    <p className="text-gray-500 text-sm">SKU: UMJR-174-2411-XS/S-BRG</p>
                    <p className="text-xl font-semibold">LE 699.00</p>



                    <div>
                        <p className="font-semibold mb-2">Size: XS/S</p>
                        <div className="flex gap-2">
                            <Button variant="outline" className="rounded-full border-black">XS/S</Button>
                            <Button variant="outline" className="rounded-full">M/L</Button>
                            <Button variant="outline" className="rounded-full">XL/2XL</Button>
                        </div>
                    </div>

                    <div>
                        <p className="font-semibold mb-2">Color: Burgundy</p>
                        <div className="flex gap-2">
                            <button className="w-8 h-8 rounded-full bg-red-900 border-2 border-white ring-1 ring-black"></button>
                            <button className="w-8 h-8 rounded-full bg-black border-2 border-white ring-1 ring-gray-200"></button>
                            <button className="w-8 h-8 rounded-full bg-white border-2 border-gray-200"></button>
                            <button className="w-8 h-8 rounded-full bg-red-700 border-2 border-white ring-1 ring-gray-200"></button>
                        </div>
                    </div>

                    <div>
                        <p className="font-semibold mb-2">Quantity:</p>
                        <div className="flex items-center border rounded-md w-fit">
                            <button className="px-3 py-1 bg-white hover:bg-gray-100">-</button>
                            <span className="px-3 py-1 border-x">1</span>
                            <button className="px-3 py-1 bg-white hover:bg-gray-100">+</button>
                        </div>
                    </div>

                    <div className="flex gap-4 mt-4">
                        <Button className="flex-1 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-full py-6">Add to cart</Button>
                        <Button className="flex-1 bg-black hover:bg-gray-800 text-white rounded-full py-6">Buy it now</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}