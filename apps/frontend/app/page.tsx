import { Hero47 } from "@/components/hero-47";
import ProductCats from "@/components/products-cats";
import NewCollections from "@/components/new-collections";
import WomenCollection from "@/components/women-collection";
import FeaturesCategories from "@/components/features-categories";
import KidsCollection from "@/components/kides-collections";

export default function Home() {
  return (
    <div>
      <Hero47
        heading="Welcome to Our Store"
        description="Discover the best products at unbeatable prices."
        image={{ src: "https://library.shadcnblocks.com/images/block/placeholder-1.svg", alt: "Hero image" }}
      />

      <ProductCats />
      <NewCollections />
      <FeaturesCategories />
      <WomenCollection />
      <KidsCollection />
    </div>
  );
}
