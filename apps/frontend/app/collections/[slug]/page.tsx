import { Suspense } from "react";
import { ProductsSidebar } from "@/components/products-sidebar";
import ProductCard from "@/components/product-card";
import ProductSorting from "@/components/product-sorting";
import BasePagination from "@/components/pagination";
import { ActiveFilters } from "@/components/active-filters";
import { fetchApi } from "@/helpers/api";
import { getMinPrice, getColors } from "@/helpers/product";
import type { ProductsResponse } from "@/types/product";
import type { CategoryFiltersResponse } from "@/types";

interface CollectionPageProps {
    params: Promise<{
        slug: string;
    }>;
    searchParams: Promise<{
        page?: string;
        sizes?: string | string[];
        colors?: string | string[];
        types?: string | string[];
        minPrice?: string;
        maxPrice?: string;
    }>;
}

function toArray(val: string | string[] | undefined): string[] {
    if (!val) return [];
    return Array.isArray(val) ? val : [val];
}

export default async function CollectionPage({ params, searchParams }: CollectionPageProps) {
    const { slug } = await params;
    const resolvedSearchParams = await searchParams;
    const page = resolvedSearchParams.page ? parseInt(resolvedSearchParams.page) : 1;

    const sizes = toArray(resolvedSearchParams.sizes);
    const colors = toArray(resolvedSearchParams.colors);
    const types = toArray(resolvedSearchParams.types);

    // Build products query
    const productsParams = new URLSearchParams();
    productsParams.set('limit', '10');
    productsParams.set('page', String(page));
    productsParams.set('categorySlug', slug);
    sizes.forEach(s => productsParams.append('sizes', s));
    colors.forEach(c => productsParams.append('colors', c));

    types.forEach(t => productsParams.append('types', t));
    if (resolvedSearchParams.minPrice) productsParams.set('minPrice', resolvedSearchParams.minPrice);
    if (resolvedSearchParams.maxPrice) productsParams.set('maxPrice', resolvedSearchParams.maxPrice);

    const [productsRes, filtersRes] = await Promise.all([
        fetchApi(`/products?${productsParams.toString()}`),
        fetchApi(`/categories/${slug}/filters`),
    ]);

    const data: ProductsResponse = await productsRes.json();
    const { data: filters }: CategoryFiltersResponse = await filtersRes.json();
    const products = data.data;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
                {/* Sidebar */}
                <div className="w-full max-w-[300px] lg:max-w-none ">
                    <Suspense fallback={<p>Loading filters...</p>}>
                        <ProductsSidebar filters={filters} />
                    </Suspense>
                </div>

                {/* Main content */}
                <div className="flex flex-col w-full">
                    <div className="mb-6 flex items-center justify-between">
                        <h1 className="text-3xl font-bold capitalize">
                            {slug?.replace('-', ' ')} Collection
                        </h1>
                        <ProductSorting />
                    </div>
                    <Suspense fallback={<p>Loading filters...</p>}>
                        <ActiveFilters categorySlug={slug} />
                    </Suspense>

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
                                    href={`/collections/${slug}/${product.slug}`}
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
