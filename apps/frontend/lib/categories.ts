export interface Category {
  name: string;
  title: string;
  image: string;
  href: string;
}

export const categories: Category[] = [
  {
    name: "men",
    title: "Men",
    image: "https://placehold.co/600x600?text=Men's+Collection",
    href: "/collections/men",
  },
  {
    name: "women",
    title: "Women",
    image: "https://placehold.co/600x600?text=Women's+Collection",
    href: "/collections/women",
  },
  {
    name: "kids",
    title: "Kids",
    image: "https://placehold.co/600x600?text=Kids+Collection",
    href: "/collections/kids",
  },
  {
    name: "accessories",
    title: "Accessories",
    image: "https://placehold.co/600x600?text=Accessories",
    href: "/collections/accessories",
  },
  {
    name: "new-arrivals",
    title: "New Arrivals",
    image: "https://placehold.co/600x600?text=New+Arrivals",
    href: "/collections/new-arrivals",
  },
];
