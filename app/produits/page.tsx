import { Suspense } from "react";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import ProductListingContent from "./ProductListingContent";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export const metadata = {
  title: "Produits - Tunisia Phone",
  description:
    "Parcourez notre catalogue de smartphones, accessoires, chargeurs, AirPods et plus encore.",
};

export default function ProduitsPage() {
  return (
    <>
      <TopBar />
      <Header />
      <NavBar />
      <main className="bg-white min-h-[60vh]">
        <div className="max-w-[1280px] mx-auto px-4 py-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
            Nos Produits
          </h1>
          <Suspense fallback={<LoadingSpinner message="Chargement des produits..." />}>
            <ProductListingContent />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}
