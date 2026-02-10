import CategoryCard from "./category-card";

const FeaturesCategories = () => {
    return (
        <section className="py-8">
            <div className="container mx-auto">
                <div className="grid grid-cols-4 gap-4 md:gap-6 auto-rows-[300px] md:auto-rows-[400px]">
                    <div className="col-span-2 row-span-2">
                        <CategoryCard
                            title="Featured Collection"
                            image="https://placehold.co/600x800/2D2638/white?text=Featured+Collection"
                            alt="Featured collection"
                            showIcon={false}
                        />
                    </div>
                    <div className="col-span-2 row-span-1">
                        <CategoryCard
                            title="Summer Essentials"
                            image="https://placehold.co/600x400/4B5563/white?text=Summer+Essentials"
                            alt="Summer essentials"
                            showIcon={false}
                        />
                    </div>

                    <div className="">
                        <CategoryCard
                            title="New Arrivals"
                            image="https://placehold.co/300x400/1E3A8A/white?text=New+Arrivals"
                            alt="New arrivals"
                            showIcon={false}
                        />
                    </div>
                    <div className="">
                        <CategoryCard
                            title="Best Sellers"
                            image="https://placehold.co/300x400/10B981/white?text=Best+Sellers"
                            alt="Best sellers"
                            showIcon={false}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FeaturesCategories;
