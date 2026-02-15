import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProductShowcase from "@/components/ProductShowcase";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-background text-foreground font-sans selection:bg-coffee/20">
      <Navbar />
      <HeroSection />
      <ProductShowcase />
      <Footer />
    </main>
  );
}
