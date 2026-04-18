import { ChevronRight } from "lucide-react";
import SectionTitle from "./section-title";
import CategoryCard from "./category-card";
import type { Category, CategoriesResponse } from "@/types/category";

const PLACEHOLDER_COLORS: Record<string, string> = {
    Men: "2D2638",
    Women: "EC4899",
    Clothing: "4B5563",
    Sports: "10B981",
    UniSex: "1E3A8A",
};

// ── Data fetching ──────────────────────────────────────────────────────────
async function getCategories(): Promise<Category[]> {
    const res = await fetch(`${process.env.API_URL}/categories/top`, {
        next: { revalidate: 3600 },
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch categories: ${res.status}`);
    }

    const json: CategoriesResponse = await res.json();
    return json.data;
}

const ProductCats = async () => {
    const categories = await getCategories();

    return (
        <section className="py-8">
            <div className="container mx-auto">
                <SectionTitle title="Shop by Category" showSeeAll={false} />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {categories.map((category) => {
                        const color =
                            PLACEHOLDER_COLORS[category.name] ?? "6D28D9";
                        return (
                            <CategoryCard
                                key={category.id}
                                title={category.name}
                                image={`https://placehold.co/400x500/${color}/white?text=${encodeURIComponent(category.name)}`}
                                alt={`${category.name} category`}
                                showIcon={true}
                                icon={ChevronRight}
                            />
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default ProductCats;
