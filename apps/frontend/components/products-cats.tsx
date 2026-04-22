import { ChevronRight } from "lucide-react";
import SectionTitle from "./section-title";
import CategoryCard from "./category-card";
import type { Category, CategoriesResponse } from "@/types/category";
import { fetchApi } from "@/helpers/api";


// ── Data fetching ──────────────────────────────────────────────────────────
async function getCategories(): Promise<Category[]> {
    const res = await fetchApi(`/categories/top`, {
        next: { revalidate: 3600 },
    });

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
                        return (
                            <CategoryCard
                                key={category.id}
                                slug={category.slug}
                                name={category.name}
                                image={category.image}
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
