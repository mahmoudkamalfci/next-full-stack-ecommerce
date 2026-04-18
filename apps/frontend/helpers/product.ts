import type { ApiProduct } from "@/types/product";

/** Returns the lowest variant price for a product. */
export function getMinPrice(product: ApiProduct): string {
    if (product.variants.length === 0) return "0.00";
    const prices = product.variants.map((v) => parseFloat(v.price));
    return Math.min(...prices).toFixed(2);
}

/** Collects unique Color option values and maps them to CSS-friendly strings. */
export function getColors(product: ApiProduct): string[] {
    const colorOption = product.options.find(
        (o) => o.name.toLowerCase() === "color"
    );
    if (!colorOption) return [];
    return colorOption.values.map((v) => v.value.toLowerCase());
}
