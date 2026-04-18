import SectionTitle from "@/components/section-title";
import ProductsCarousel from "./products-carousel";
import type { ApiProduct, ProductItem, ProductsResponse } from "@/types/product";

// ── Data fetching ──────────────────────────────────────────────────────────

async function getWomenProducts(): Promise<ApiProduct[]> {
    const res = await fetch(
        `${process.env.API_URL}/products?limit=10&categorySlug=women`,
        { next: { revalidate: 3600 } }
    );

    if (!res.ok) {
        throw new Error(`Failed to fetch women products: ${res.status}`);
    }

    const json: ProductsResponse = await res.json();
    return json.data;
}

// ── Helpers ────────────────────────────────────────────────────────────────

/** Returns the lowest variant price for a product. */
function getMinPrice(product: ApiProduct): string {
    if (product.variants.length === 0) return "0.00";
    const prices = product.variants.map((v) => parseFloat(v.price));
    return Math.min(...prices).toFixed(2);
}

/** Collects unique Color option values and maps them to CSS-friendly strings. */
function getColors(product: ApiProduct): string[] {
    const colorOption = product.options.find(
        (o) => o.name.toLowerCase() === "color"
    );
    if (!colorOption) return [];
    return colorOption.values.map((v) => v.value.toLowerCase());
}

// ── Component ──────────────────────────────────────────────────────────────

const WomenCollection = async () => {
    const products = await getWomenProducts();

    const items: ProductItem[] = products.map((product) => ({
        id: product.id,
        name: product.name,
        price: `LE ${getMinPrice(product)}`,
        image: `https://placehold.co/600x800/8B4789/white?text=${encodeURIComponent(product.name)}`,
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
