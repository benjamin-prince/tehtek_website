import Hero from "@/components/Hero";
import Categories from "@/components/Categories";
import FeaturedProducts from "@/components/FeaturedProducts";
import Services from "@/components/Services";
import WhatsAppCTA from "@/components/WhatsAppCTA";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <FeaturedProducts />
        <Hero />
        <Categories />
        <Services />
        <WhatsAppCTA />
      </main>
      <Footer />
    </>
  );
}
