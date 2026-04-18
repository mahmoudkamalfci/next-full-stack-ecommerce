import { Skeleton } from "@/components/ui/skeleton";

const ProductCatsSkeleton = () => {
    return (
        <section className="py-8">
            <div className="container mx-auto">
                {/* Section title skeleton */}
                <Skeleton className="h-8 w-48 mb-6" />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div
                            key={i}
                            className="relative rounded-xl overflow-hidden aspect-3/4"
                        >
                            <Skeleton className="w-full h-full" />
                            <div className="absolute bottom-0 left-0 p-6 w-full">
                                <Skeleton className="h-7 w-3/4" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ProductCatsSkeleton;
