import SectionTitle from "@/components/section-title";
import ProductsCarousel from "./products-carousel";
import type { ApiProduct, ProductItem, ProductsResponse } from "@/types/product";
import { getMinPrice, getColors } from "@/helpers/product";

// ── Data fetching ──────────────────────────────────────────────────────────

async function getKidsProducts(): Promise<ApiProduct[]> {
    const res = await fetch(
        `${process.env.API_URL}/products?limit=10&categorySlug=kids`,
        { next: { revalidate: 3600 } }
    );

    if (!res.ok) {
        throw new Error(`Failed to fetch kids products: ${res.status}`);
    }

    const json: ProductsResponse = await res.json();
    return json.data;
}


// ── Component ──────────────────────────────────────────────────────────────

const KidsCollection = async () => {
    const products = await getKidsProducts();

    const items: ProductItem[] = products.map((product) => ({
        id: product.id,
        name: product.name,
        price: `LE ${getMinPrice(product)}`,
        image: `https://placehold.co/600x800/4ECDC4/white?text=${encodeURIComponent(product.name)}`,
        colors: getColors(product),
    }));

    return (
        <section className="py-8">
            <div className="container mx-auto">
                <SectionTitle title="Kids Sports Collection" />
                <ProductsCarousel products={items} />
            </div>
        </section>
    );
};

export default KidsCollection;
