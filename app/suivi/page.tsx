import { Suspense } from "react";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import SuiviContent from "./SuiviContent";

export const metadata = {
  title: "Suivi de commande - Tunisia Phone",
  description: "Suivez l'etat de votre commande Tunisia Phone.",
};

export default function SuiviPage() {
  return (
    <>
      <TopBar />
      <Header />
      <NavBar />
      <main className="bg-white min-h-[60vh]">
        <div className="max-w-[800px] mx-auto px-4 py-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
            Suivre ma commande
          </h1>
          <Suspense fallback={null}>
            <SuiviContent />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}
