import { ChevronRight } from "lucide-react";
import SectionTitle from "./section-title";
import CategoryCard from "./category-card";

const categories = [
    {
        id: 1,
        title: "Men",
        href: "/images/men-category.jpg",
        alt: "Men's athletic wear",
        image: "https://placehold.co/400x500/2D2638/white?text=Men",
    },
    {
        id: 2,
        title: "Women",
        href: "/images/women-category.jpg",
        alt: "Women's athletic wear",
        image: "https://placehold.co/400x500/EC4899/white?text=Women",
    },
    {
        id: 3,
        title: "Unisex",
        href: "/images/unisex-category.jpg",
        alt: "Unisex athletic wear",
        image: "https://placehold.co/400x500/4B5563/white?text=Unisex",
    },
    {
        id: 4,
        title: "Kids",
        href: "/images/kids-category.jpg",
        alt: "Kids athletic wear",
        image: "https://placehold.co/400x500/10B981/white?text=Kids",
    },
    {
        id: 5,
        title: "Accessories",
        href: "/images/accessories-category.jpg",
        alt: "Athletic accessories",
        image: "https://placehold.co/400x500/1E3A8A/white?text=Accessories",
    },
];

const ProductCats = () => {
    return (
        <section className="py-8">
            <div className="container mx-auto">
                <SectionTitle title="Shop by Category" showSeeAll={false} />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
                    {categories.map((category) => (
                        <CategoryCard
                            key={category.id}
                            title={category.title}
                            image={category.image}
                            alt={category.alt}
                            showIcon={true}
                            icon={ChevronRight}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ProductCats;
