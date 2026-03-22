import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import PanierContent from "./PanierContent";
import { Suspense } from "react";

export const metadata = {
  title: "Mon Panier - Tunisia Phone",
};

export default function PanierPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <TopBar />
      <Header />
      <NavBar />
      <main className="flex-1 max-w-[1280px] mx-auto px-4 py-8 w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Mon Panier</h1>
        <Suspense fallback={<div className="text-gray-500">Chargement...</div>}>
          <PanierContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
