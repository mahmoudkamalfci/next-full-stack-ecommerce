import { Suspense } from "react";
import { Hero47 } from "@/components/hero-47";
import ProductCats from "@/components/products-cats";
import ProductCatsSkeleton from "@/components/products-cats-skeleton";
import NewCollections from "@/components/new-collections";
import ProductsSkeleton from "@/components/products-skeleton";
import WomenCollection from "@/components/women-collection";
import FeaturesCategories from "@/components/features-categories";
import FeaturesCategoriesSkeleton from "@/components/features-categories-skeleton";
import KidsCollection from "@/components/kides-collections";

export default function Home() {
  return (
    <div>
      <Hero47
        heading="Welcome to Our Store"
        description="Discover the best products at unbeatable prices."
        image={{ src: "https://library.shadcnblocks.com/images/block/placeholder-1.svg", alt: "Hero image" }}
      />

      <Suspense fallback={<ProductCatsSkeleton />}>
        <ProductCats />
      </Suspense>
      <Suspense fallback={<ProductsSkeleton />}>
        <NewCollections />
      </Suspense>
      <Suspense fallback={<FeaturesCategoriesSkeleton />}>
        <FeaturesCategories />
      </Suspense>
      <Suspense fallback={<ProductsSkeleton />}>
        <WomenCollection />
      </Suspense>
      <Suspense fallback={<ProductsSkeleton />}>
        <KidsCollection />
      </Suspense>
    </div>
  );
}
