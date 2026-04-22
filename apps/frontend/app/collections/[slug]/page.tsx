import { Suspense } from "react";
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
    searchParams: Promise<{
        page?: string;
    }>;
}

export default async function CollectionPage({ params, searchParams }: CollectionPageProps) {
    const { slug } = await params;
    const resolvedSearchParams = await searchParams;
    const page = resolvedSearchParams.page ? parseInt(resolvedSearchParams.page) : 1;

    // Fetch products based on category slug
    const res = await fetchApi(`/products?limit=10&page=${page}&categorySlug=${slug}`);
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

                            return (
                                <ProductCard
                                    key={product.id}
                                    name={product.name}
                                    price={parseFloat(minPrice)}
                                    image={product.images[0]?.imageUrl || ""}
                                    colors={colors}
                                    hoveredImage={product.images[1]?.imageUrl || ""}
                                />
                            );
                        })}
                    </div>

                    <div className="mt-12 flex justify-center">
                        <Suspense fallback={<div className="h-10"></div>}>
                            <BasePagination
                                totalPages={data.pagination.totalPages}
                                currentPage={data.pagination.page}
                                total={data.pagination.total}
                            />
                        </Suspense>
                    </div>
                </div>
            </div>
        </div>
    );
}
