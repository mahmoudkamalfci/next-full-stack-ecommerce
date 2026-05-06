export interface CartProduct {
    id: string;
    sku: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
    size: string;
    color: string;
}

export interface CategoryFilters {
    sizes: string[];
    colors: string[];
    productTypes: string[];
}

export interface CategoryFiltersResponse {
    data: CategoryFilters;
}