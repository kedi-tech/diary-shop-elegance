import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/home/HeroSection";
import { CategoriesSection } from "@/components/home/CategoriesSection";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { PromoSection } from "@/components/home/PromoSection";
import { NewArrivals } from "@/components/home/NewArrivals";
import { FeaturesSection } from "@/components/home/FeaturesSection";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <FeaturesSection />
      <CategoriesSection />
      <FeaturedProducts />
      <PromoSection />
      <NewArrivals />
    </Layout>
  );
};

export default Index;
