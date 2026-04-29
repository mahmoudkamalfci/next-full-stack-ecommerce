import { notFound } from "next/navigation";
import { fetchApi } from "@/helpers/api";
import { ProductImageCarousel } from "@/components/product-image-carousel";
import { ProductInfo } from "@/components/product-info";
import { ProductDetails } from "@/components/product-desc";
import type { ApiProduct } from "@/types/product";

interface ProductPageProps {
    params: Promise<{
        slug: string;
        productSlug: string;
    }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
    const { productSlug } = await params;
    
    const res = await fetchApi(`/products/${productSlug}`);
    
    if (!res.ok) {
        if (res.status === 404) notFound();
        throw new Error("Failed to fetch product");
    }

    const { data: product }: { data: ApiProduct } = await res.json();

    return (
        <div className="container mx-auto px-4 py-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
                {/* Left Column: Image Carousel */}
                <div className="w-full">
                    <ProductImageCarousel images={product.images} />
                </div>

                {/* Right Column: Product Details */}
                <ProductInfo product={product} />
            </div>

            <div>
                <ProductDetails description={product.description || ""} />
            </div>
        </div>
    )
}