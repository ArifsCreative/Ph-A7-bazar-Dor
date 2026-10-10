
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ProductSections from "@/components/ProductSections";

export default function Home() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />
        <ProductSections />
      </main>
    </>
  );
}
