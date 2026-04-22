export interface Category {
    id: number;
    parentId: number | null;
    name: string;
    slug: string;
    description: string;
    isActive: boolean;
    isFeatured: boolean;
    createdAt: string;
    image: string;
    children: Category[];
}

export interface CategoriesResponse {
    data: Category[];
}