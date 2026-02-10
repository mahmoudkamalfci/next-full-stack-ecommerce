import type { LucideIcon } from "lucide-react";

interface CategoryCardProps {
    title: string;
    image: string;
    alt: string;
    showIcon?: boolean;
    icon?: LucideIcon;
    label?: string;
}

const CategoryCard = ({
    title,
    image,
    alt,
    showIcon = true,
    icon: Icon,
    label,
}: CategoryCardProps) => {
    return (
        <div
            className="relative rounded-xl overflow-hidden aspect-[3/4] group cursor-pointer h-full w-full"
        >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src={image}
                alt={alt}
                className="object-cover w-full h-full transition-transform duration-500 ease-in-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 text-white p-6 pointer-events-none">
                {showIcon && Icon && (
                    <Icon className="inline-block rounded-full bg-white text-black invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-500 ease-in-out w-[28px] h-[28px] p-1" />
                )}

                {label && <p className="text-white font-normal text-sm mt-2 mb-4">{label}</p>}
                <h3
                    className="text-2xl font-bold group-hover:translate-y-1/4 transition-transform duration-500 ease-in-out"
                >
                    {title}
                </h3>
            </div>
        </div>
    );
};

export default CategoryCard;
