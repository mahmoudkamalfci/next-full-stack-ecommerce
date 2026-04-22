import CategoryCard from "./category-card";
import type { Category, CategoriesResponse } from "@/types/category";
import SectionTitle from "./section-title";
import { fetchApi } from "@/helpers/api";

// ── Data fetching ──────────────────────────────────────────────────────────
async function getFeaturedCategories(): Promise<Category[]> {
    const res = await fetchApi(`/categories?isFeatured=true&limit=4`, {
        next: { revalidate: 3600 },
    });

    const json: CategoriesResponse = await res.json();
    return json.data;
}

const PLACEHOLDER_COLORS: Record<string, string> = {
    Men: "2D2638",
    Women: "EC4899",
    Accessories: "4B5563",
    Kids: "10B981",
};

const FeaturesCategories = async () => {
    const categories = await getFeaturedCategories();

    // Ensure we always have at most 4 categories to fill the grid layout
    const [first, second, third, fourth] = categories;

    return (
        <section className="py-8">
            <div className="container mx-auto">
                <SectionTitle title="Featured Categories" />
                <div className="grid grid-cols-4 gap-4 md:gap-6 auto-rows-[300px] md:auto-rows-[400px]">

                    {first && (
                        <div className="col-span-2 row-span-2">
                            <CategoryCard
                                name={first.name}
                                image={first.image}
                                alt={`${first.name} category`}
                                showIcon={false}
                                slug={first.slug}
                            />
                        </div>
                    )}
                    {second && (
                        <div className="col-span-2 row-span-1">
                            <CategoryCard
                                name={second.name}
                                image={second.image}
                                alt={`${second.name} category`}
                                showIcon={false}
                                slug={second.slug}
                            />
                        </div>
                    )}
                    {third && (
                        <div>
                            <CategoryCard
                                name={third.name}
                                image={third.image}
                                alt={`${third.name} category`}
                                showIcon={false}
                                slug={third.slug}
                            />
                        </div>
                    )}
                    {fourth && (
                        <div>
                            <CategoryCard
                                name={fourth.name}
                                image={fourth.image}
                                alt={`${fourth.name} category`}
                                showIcon={false}
                                slug={fourth.slug}
                            />
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default FeaturesCategories;
