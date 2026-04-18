// ── API response types for /products ──────────────────────────────────────

export interface OptionValue {
    id: number;
    optionId: number;
    value: string;
}

export interface VariantOptionValue {
    variantId: number;
    optionValueId: number;
    optionValue: OptionValue;
}

export interface Variant {
    id: number;
    productId: number;
    sku: string;
    price: string;
    inventoryQuantity: number;
    optionValues: VariantOptionValue[];
}

export interface ProductOption {
    id: number;
    productId: number;
    name: string;
    values: OptionValue[];
}

export interface ApiProduct {
    id: number;
    name: string;
    slug: string;
    description: string;
    isActive: boolean;
    createdAt: string;
    options: ProductOption[];
    variants: Variant[];
}

export interface ProductsResponse {
    data: ApiProduct[];
    pagination: {
        total: number;
        page: number;
        totalPages: number;
    };
}

// ── UI-layer product shape (serializable, passed to client components) ─────

export interface ProductItem {
    id: number;
    name: string;
    price: string;
    image: string;
    colors: string[];
}
