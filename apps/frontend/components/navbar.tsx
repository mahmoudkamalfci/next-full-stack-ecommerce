"use client"

import Link from "next/link";
import { Button } from "./ui/button";
import { Search, ShoppingCart, User } from "lucide-react";
import { useEffect, useState } from "react";

import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

interface ProductCategory {
    title: string;
    href: string;
    children?: ProductCategory[];
}

const Men: ProductCategory[] = [
    {
        title: "All Clothes",
        href: "/collections/men",
    },
    {
        title: "Top & Crew",
        href: "/collections/men",
        children: [
            {
                title: "T-Shirts",
                href: "/collections/men-t-shirts",
            },
            {
                title: "Casual Shirts",
                href: "/collections/men-casual-shirts",
            }
        ]
    },
    {
        title: "Men Bottoms",
        href: "/collections/men-bottoms",
    },
    {
        title: "Hoodies",
        href: "/collections/men-hoodies",
    },
    {
        title: "sacks",
        href: "/collections/men-sacks",
    },
    {
        title: "boxer",
        href: "/collections/men-boxer",
    },
]

const women: ProductCategory[] = [
    {
        title: "All Clothes",
        href: "/collections/women",
    },
    {
        title: "Dresses",
        href: "/collections/women-dresses",
    },
    {
        title: "Tops",
        href: "/collections/women-tops",
    },
    {
        title: "Bottoms",
        href: "/collections/women-bottoms",
    },
    {
        title: "Hoodies",
        href: "/collections/women-hoodies",
    },
]

const kids: ProductCategory[] = [
    {
        title: "All Clothes",
        href: "/collections/kids",
    },
    {
        title: "T-Shirts",
        href: "/collections/kids-t-shirts",
    },
    {
        title: "Shirts",
        href: "/collections/kids-shirts",
    },
    {
        title: "Bottoms",
        href: "/collections/kids-bottoms",
    },
    {
        title: "Hoodies",
        href: "/collections/kids-hoodies",
    },
]

const newArrivals: ProductCategory[] = [
    {
        title: "All New Arrivals",
        href: "/collections/new-arrivals",
    },
    {
        title: "Men",
        href: "/collections/men-new-arrivals",
    },
    {
        title: "Women",
        href: "/collections/women-new-arrivals",
    },
    {
        title: "Kids",
        href: "/collections/kids-new-arrivals",
    },
]

const Navbar = () => {
    const [showNavbar, setShowNavbar] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY < lastScrollY || currentScrollY < 10) {
                // Scrolling up or at the top
                setShowNavbar(true);
            } else if (currentScrollY > lastScrollY && currentScrollY > 80) {
                // Scrolling down and past threshold
                setShowNavbar(false);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [lastScrollY]);

    return (
        <nav
            className={`bg-white fixed w-full z-20 transition-transform duration-300 ${showNavbar ? "translate-y-0" : "-translate-y-full"
                }`}
        >
            <div className="container mx-auto py-6 flex justify-between items-center">
                <div className="flex items-center gap-16">
                    <Link href="/" className="text-2xl font-bold text-gray-800" aria-label="Home">
                        MyStore
                    </Link>
                    <NavigationMenu>
                        <NavigationMenuList>
                            <NavigationMenuItem>
                                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                                    <Link href="/">Home</Link>
                                </NavigationMenuLink>

                            </NavigationMenuItem>
                            <NavigationMenuItem className="relative">
                                <NavigationMenuTrigger>Men</NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <ul className="grid w-[200px] gap-2 md:grid-cols-1 p-4">
                                        {Men.map((item) => (
                                            <li key={item.title} className="">
                                                <NavigationMenuLink asChild>
                                                    <Link href={item.href} className="cursor-pointer text-sm leading-none font-medium group">
                                                        <span className="relative">
                                                            {item.title}
                                                            <span
                                                                className="absolute left-0 -bottom-1 h-[1px] w-0 bg-primary transition-all duration-300 group-hover:w-full"
                                                                aria-hidden="true"
                                                            />
                                                        </span>
                                                    </Link>
                                                </NavigationMenuLink>
                                            </li>
                                        ))}
                                    </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>
                            <NavigationMenuItem className="relative">
                                <NavigationMenuTrigger>Women</NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <ul className="grid w-[200px] gap-2 md:grid-cols-1 p-4">
                                        {women.map((item) => (
                                            <li key={item.title} className="">
                                                <NavigationMenuLink asChild>
                                                    <Link href={item.href} className="cursor-pointer text-sm leading-none font-medium group">
                                                        <span className="relative">
                                                            {item.title}
                                                            <span
                                                                className="absolute left-0 -bottom-1 h-[1px] w-0 bg-primary transition-all duration-300 group-hover:w-full"
                                                                aria-hidden="true"
                                                            />
                                                        </span>
                                                    </Link>
                                                </NavigationMenuLink>
                                            </li>
                                        ))}
                                    </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>
                            <NavigationMenuItem className="relative">
                                <NavigationMenuTrigger>Kids</NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <ul className="grid w-[200px] gap-2 md:grid-cols-1 p-4">
                                        {kids.map((item) => (
                                            <li key={item.title} className="">
                                                <NavigationMenuLink asChild>
                                                    <Link href={item.href} className="cursor-pointer text-sm leading-none font-medium group">
                                                        <span className="relative">
                                                            {item.title}
                                                            <span
                                                                className="absolute left-0 -bottom-1 h-[1px] w-0 bg-primary transition-all duration-300 group-hover:w-full"
                                                                aria-hidden="true"
                                                            />
                                                        </span>
                                                    </Link>
                                                </NavigationMenuLink>
                                            </li>
                                        ))}
                                    </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>

                            <NavigationMenuItem>
                                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                                    <Link href="/products">Accessories</Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>

                            <NavigationMenuItem className="relative">
                                <NavigationMenuTrigger>New Arrivals</NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <ul className="grid w-[200px] gap-2 md:grid-cols-1 p-4">
                                        {newArrivals.map((item) => (
                                            <li key={item.title} className="">
                                                <NavigationMenuLink asChild>
                                                    <Link href={item.href} className="cursor-pointer text-sm leading-none font-medium group">
                                                        <span className="relative">
                                                            {item.title}
                                                            <span
                                                                className="absolute left-0 -bottom-1 h-[1px] w-0 bg-primary transition-all duration-300 group-hover:w-full"
                                                                aria-hidden="true"
                                                            />
                                                        </span>
                                                    </Link>
                                                </NavigationMenuLink>
                                            </li>
                                        ))}
                                    </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-4">
                        <Link href="/contact" className="text-black-600 hover:text-gray-800">
                            Find Us
                        </Link>
                        <Link href="/contact" className="text-black-600 hover:text-gray-800">
                            Contact Us
                        </Link>
                    </div>
                    <div className="flex items-center gap-1">
                        <Button size="icon" variant="ghost">
                            <Search />
                        </Button>
                        <Button size="icon" variant="ghost">
                            <User />
                        </Button>
                        <Button size="icon" variant="ghost">
                            <ShoppingCart />
                        </Button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
