import { Skeleton } from "@/components/ui/skeleton";

const NewCollectionsSkeleton = () => {
    return (
        <section className="py-8">
            <div className="container mx-auto">
                {/* Section title skeleton */}
                <Skeleton className="h-8 w-40 mb-6" />

                {/* Carousel cards — 4 per row matching basis-1/4 */}
                <div className="grid grid-cols-4 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="flex flex-col gap-4">
                            {/* Product image */}
                            <Skeleton className="w-full aspect-3/4 rounded-md" />
                            {/* Product name */}
                            <Skeleton className="h-5 w-3/4" />
                            {/* Product price */}
                            <Skeleton className="h-4 w-1/3" />
                            {/* Color swatches */}
                            <div className="flex gap-2">
                                <Skeleton className="w-6 h-6 rounded-full" />
                                <Skeleton className="w-6 h-6 rounded-full" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Progress bar + nav buttons */}
                <div className="flex justify-between items-center gap-8 mt-12">
                    <Skeleton className="h-1 w-full rounded-full" />
                    <div className="flex items-center gap-4">
                        <Skeleton className="w-10 h-10 rounded-full" />
                        <Skeleton className="w-10 h-10 rounded-full" />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default NewCollectionsSkeleton;
