import SectionTitle from "@/components/section-title";
import ProductsCarousel from "./products-carousel";
import type { ApiProduct, ProductItem, ProductsResponse } from "@/types/product";
import { getMinPrice, getColors } from "@/helpers/product";
import { fetchApi } from "@/helpers/api";

// ── Data fetching ──────────────────────────────────────────────────────────

async function getNewArrivals(): Promise<ApiProduct[]> {
    const res = await fetchApi(
        `/products?limit=10&categorySlug=new-arrivals`,
        { next: { revalidate: 3600 } }
    );

    const json: ProductsResponse = await res.json();
    return json.data;
}


// ── Component ──────────────────────────────────────────────────────────────

const NewCollections = async () => {
    const products = await getNewArrivals();

    const items: ProductItem[] = products.map((product) => ({
        id: product.id,
        name: product.name,
        price: `LE ${getMinPrice(product)}`,
        image: `https://placehold.co/600x800/2D2638/white?text=${encodeURIComponent(product.name)}`,
        colors: getColors(product),
    }));

    return (
        <section className="py-8">
            <div className="container mx-auto">
                <SectionTitle title="New Arrivals" />
                <ProductsCarousel products={items} />
            </div>
        </section>
    );
};

export default NewCollections;
