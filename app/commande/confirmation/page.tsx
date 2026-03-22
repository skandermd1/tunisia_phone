import { Suspense } from "react";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import ConfirmationContent from "./ConfirmationContent";

export const metadata = {
  title: "Commande confirmee - Tunisia Phone",
  description: "Votre commande a ete confirmee avec succes.",
};

export default function ConfirmationPage() {
  return (
    <>
      <TopBar />
      <Header />
      <NavBar />
      <main className="bg-white min-h-[60vh]">
        <div className="max-w-[600px] mx-auto px-4 py-16 text-center">
          <Suspense fallback={null}>
            <ConfirmationContent />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}
