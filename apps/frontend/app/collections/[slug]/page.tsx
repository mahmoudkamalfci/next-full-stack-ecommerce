import { ProductsSidebar } from "@/components/products-sidebar";
import ProductCard from "@/components/product-card";
import ProductSorting from "@/components/product-sorting";
import BasePagination from "@/components/pagination";
import { fetchApi } from "@/helpers/api";
import { getMinPrice, getColors } from "@/helpers/product";
import type { ProductsResponse } from "@/types/product";

interface CollectionPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export default async function CollectionPage({ params }: CollectionPageProps) {
    const { slug } = await params;

    // Fetch products based on category slug
    const res = await fetchApi(`/products?limit=10&categorySlug=${slug}`);
    const data: ProductsResponse = await res.json();
    const products = data.data;

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
                        {products.map((product) => {
                            const minPrice = getMinPrice(product);
                            const colors = getColors(product);

                            // fallback image
                            const imageUrl = "https://placehold.co/600x800/2D2638/white?text=" + encodeURIComponent(product.name);
                            const hoveredImageUrl = "https://placehold.co/600x800/4B5563/white?text=" + encodeURIComponent(product.name + " Alt");

                            return (
                                <ProductCard
                                    key={product.id}
                                    name={product.name}
                                    price={parseFloat(minPrice)}
                                    image={imageUrl}
                                    colors={colors}
                                    hoveredImage={hoveredImageUrl}
                                />
                            );
                        })}
                    </div>

                    <div className="mt-12 flex justify-center">

                        <BasePagination />
                    </div>
                </div>
            </div>
        </div>
    );
}
