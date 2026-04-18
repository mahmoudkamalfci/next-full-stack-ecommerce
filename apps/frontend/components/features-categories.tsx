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
                                title={first.name}
                                image={`https://placehold.co/600x800/${PLACEHOLDER_COLORS[first.name] ?? "6D28D9"}/white?text=${encodeURIComponent(first.name)}`}
                                alt={`${first.name} category`}
                                showIcon={false}
                            />
                        </div>
                    )}
                    {second && (
                        <div className="col-span-2 row-span-1">
                            <CategoryCard
                                title={second.name}
                                image={`https://placehold.co/600x400/${PLACEHOLDER_COLORS[second.name] ?? "6D28D9"}/white?text=${encodeURIComponent(second.name)}`}
                                alt={`${second.name} category`}
                                showIcon={false}
                            />
                        </div>
                    )}
                    {third && (
                        <div>
                            <CategoryCard
                                title={third.name}
                                image={`https://placehold.co/300x400/${PLACEHOLDER_COLORS[third.name] ?? "6D28D9"}/white?text=${encodeURIComponent(third.name)}`}
                                alt={`${third.name} category`}
                                showIcon={false}
                            />
                        </div>
                    )}
                    {fourth && (
                        <div>
                            <CategoryCard
                                title={fourth.name}
                                image={`https://placehold.co/300x400/${PLACEHOLDER_COLORS[fourth.name] ?? "6D28D9"}/white?text=${encodeURIComponent(fourth.name)}`}
                                alt={`${fourth.name} category`}
                                showIcon={false}
                            />
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default FeaturesCategories;
