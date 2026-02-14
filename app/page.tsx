import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProductShowcase from "@/components/ProductShowcase";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-background text-foreground font-sans selection:bg-coffee/20">
      <Navbar />
      <HeroSection />
      <ProductShowcase />

      {/* Footer / Copyright */}
      <footer className="py-8 text-center text-sm text-foreground/40 bg-background">
        <p>&copy; {new Date().getFullYear()} Drankenreclame.nl. All rights reserved.</p>
      </footer>
    </main>
  );
}
