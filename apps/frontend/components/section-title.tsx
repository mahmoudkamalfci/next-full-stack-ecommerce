import { ChevronRight } from "lucide-react";
import Link from "next/link";

interface SectionTitleProps {
    title: string;
    linkTo?: string;
    showSeeAll?: boolean;
}

const SectionTitle = ({ title, linkTo = "/products", showSeeAll = true }: SectionTitleProps) => {
    return (
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-4xl font-bold">{title}</h2>
            {showSeeAll && (
                <Link
                    href={linkTo}
                    className="relative text-primary flex items-center group"
                >
                    <span className="relative">
                        See all
                        <span
                            className="absolute left-0 -bottom-1 h-[2px] w-0 bg-primary transition-all duration-300 group-hover:w-full"
                            aria-hidden="true"
                        />
                    </span>
                    <ChevronRight
                        className="inline-block ms-2 rounded-full bg-gray-200 text-black w-[24px] h-[24px] p-1 group-hover:bg-black group-hover:text-white transition-all duration-300 ease-in-out"
                    />
                </Link>
            )}
        </div>
    );
};

export default SectionTitle;
