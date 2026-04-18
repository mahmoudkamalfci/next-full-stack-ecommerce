import { Skeleton } from "@/components/ui/skeleton";

const FeaturesCategoriesSkeleton = () => {
    return (
        <section className="py-8">
            <div className="container mx-auto">
                {/* Section title */}
                <Skeleton className="h-8 w-52 mb-6" />

                {/* Bento grid — mirrors FeaturesCategories layout */}
                <div className="grid grid-cols-4 gap-4 md:gap-6 auto-rows-[300px] md:auto-rows-[400px]">

                    {/* Cell 1 — large, left, spans 2 cols × 2 rows */}
                    <div className="col-span-2 row-span-2 relative overflow-hidden rounded-xl">
                        <Skeleton className="absolute inset-0 rounded-xl" />
                        {/* Title bar overlay at bottom */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 flex flex-col gap-2">
                            <Skeleton className="h-5 w-1/3 bg-white/20" />
                        </div>
                    </div>

                    {/* Cell 2 — wide, top-right, spans 2 cols × 1 row */}
                    <div className="col-span-2 row-span-1 relative overflow-hidden rounded-xl">
                        <Skeleton className="absolute inset-0 rounded-xl" />
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                            <Skeleton className="h-5 w-1/4 bg-white/20" />
                        </div>
                    </div>

                    {/* Cell 3 — bottom-right first */}
                    <div className="relative overflow-hidden rounded-xl">
                        <Skeleton className="absolute inset-0 rounded-xl" />
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                            <Skeleton className="h-5 w-1/3 bg-white/20" />
                        </div>
                    </div>

                    {/* Cell 4 — bottom-right second */}
                    <div className="relative overflow-hidden rounded-xl">
                        <Skeleton className="absolute inset-0 rounded-xl" />
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                            <Skeleton className="h-5 w-1/3 bg-white/20" />
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default FeaturesCategoriesSkeleton;
