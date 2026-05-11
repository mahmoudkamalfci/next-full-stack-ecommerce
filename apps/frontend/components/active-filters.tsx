"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { X } from "lucide-react";

export function ActiveFilters({ categorySlug }: { categorySlug: string }) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const activeSizes = searchParams.getAll("sizes");
    const activeColors = searchParams.getAll("colors");
    const activeTypes = searchParams.getAll("types");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");

    const hasFilters = activeSizes.length > 0 || activeColors.length > 0 || activeTypes.length > 0 || minPrice || maxPrice;

    if (!hasFilters) return null;

    const formattedCategory = categorySlug.replace('-', ' ');
    const categoryName = formattedCategory.charAt(0).toUpperCase() + formattedCategory.slice(1);

    const removeFilter = (key: string, value?: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            const current = params.getAll(key);
            params.delete(key);
            current.filter(v => v !== value).forEach(v => params.append(key, v));
        } else {
            params.delete(key);
        }
        params.set("page", "1");
        router.push(`${pathname}?${params.toString()}`);
    };

    const removePrice = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete("minPrice");
        params.delete("maxPrice");
        params.set("page", "1");
        router.push(`${pathname}?${params.toString()}`);
    };

    const clearAll = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete("sizes");
        params.delete("colors");
        params.delete("types");
        params.delete("minPrice");
        params.delete("maxPrice");
        params.set("page", "1");
        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="flex flex-wrap gap-3 items-center mb-6">
            {activeTypes.map(type => (
                <button
                    key={`type-${type}`}
                    onClick={() => removeFilter("types", type)}
                    className="flex items-center gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-1.5 rounded-full text-sm transition-colors"
                >
                    {categoryName} / {type} <X className="w-3.5 h-3.5" />
                </button>
            ))}
            {activeSizes.map(size => (
                <button
                    key={`size-${size}`}
                    onClick={() => removeFilter("sizes", size)}
                    className="flex items-center gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-1.5 rounded-full text-sm transition-colors"
                >
                    {categoryName} / Size: {size} <X className="w-3.5 h-3.5" />
                </button>
            ))}
            {activeColors.map(color => (
                <button
                    key={`color-${color}`}
                    onClick={() => removeFilter("colors", color)}
                    className="flex items-center gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-1.5 rounded-full text-sm transition-colors"
                >
                    {categoryName} / Color: {color} <X className="w-3.5 h-3.5" />
                </button>
            ))}
            {(minPrice || maxPrice) && (
                <button
                    onClick={removePrice}
                    className="flex items-center gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-1.5 rounded-full text-sm transition-colors"
                >
                    {categoryName} / Price: {minPrice || 0} - {maxPrice || "Any"} <X className="w-3.5 h-3.5" />
                </button>
            )}

            <button
                onClick={clearAll}
                className="text-sm text-primary hover:text-primary/80 underline underline-offset-4 ml-2"
            >
                Clear all
            </button>
        </div>
    );
}
