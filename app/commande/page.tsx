import { Suspense } from "react";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import CommandeContent from "./CommandeContent";

export const metadata = {
  title: "Commander - Tunisia Phone",
  description: "Finalisez votre commande sur Tunisia Phone.",
};

export default function CommandePage() {
  return (
    <>
      <TopBar />
      <Header />
      <NavBar />
      <main className="bg-white min-h-[60vh]">
        <div className="max-w-[1280px] mx-auto px-4 py-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
            Passer une commande
          </h1>
          <Suspense fallback={<LoadingSpinner message="Chargement..." />}>
            <CommandeContent />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}
