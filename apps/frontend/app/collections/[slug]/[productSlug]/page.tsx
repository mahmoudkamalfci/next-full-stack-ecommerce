import { ProductImageCarousel } from "@/components/product-image-carousel";
import { ProductInfo } from "@/components/product-info";
import { ProductDetails } from "@/components/product-desc";

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
                <ProductInfo images={images} />
            </div>

            <div>
                <ProductDetails />
            </div>
        </div>
    )
}