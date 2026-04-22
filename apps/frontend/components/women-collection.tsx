import SectionTitle from "@/components/section-title";
import ProductsCarousel from "./products-carousel";
import type { ApiProduct, ProductItem, ProductsResponse } from "@/types/product";
import { getMinPrice, getColors } from "@/helpers/product";
import { fetchApi } from "@/helpers/api";

// ── Data fetching ──────────────────────────────────────────────────────────

async function getWomenProducts(): Promise<ApiProduct[]> {
    const res = await fetchApi(
        `/products?limit=10&categorySlug=women`,
        { next: { revalidate: 3600 } }
    );

    const json: ProductsResponse = await res.json();
    return json.data;
}


// ── Component ──────────────────────────────────────────────────────────────

const WomenCollection = async () => {
    const products = await getWomenProducts();

    const items: ProductItem[] = products.map((product) => ({
        id: product.id,
        name: product.name,
        price: `LE ${getMinPrice(product)}`,
        image: product.images[0]?.imageUrl || '',
        colors: getColors(product),
    }));

    return (
        <section className="py-8">
            <div className="container mx-auto">
                <SectionTitle title="Women's Collection" />
                <ProductsCarousel products={items} />
            </div>
        </section>
    );
};

export default WomenCollection;
